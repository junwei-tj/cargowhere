//Run the file in the console with node updateFirestore.js
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const axios = require('axios');

// Setup database references
const config = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://cargowhere-a2ccf-default-rtdb.firebaseio.com',
};
const app = admin.initializeApp(config);
const database = admin.database();
let ref = database.ref("/");

// Declare global variables
const INTERVAL = 60000; // in ms
let oldData = {};
let availabilityData = {};
let updateData = {};
let dailyKey = ['', -1];
let currentDate = (new Date).getDate();

// first run, fetch the data from database and cache it in a local variable
console.log(`Starting run at ${new Date()}`);
console.log('fetching database data...');
ref.once("value", function(snapshot) {
    console.log('Data retrieved');
    oldData = snapshot.val();
    checkDailyKey();
});

// Check daily key for URA API
function checkDailyKey(){
    currentDate = (new Date).getDate();
    if (dailyKey[1] !== currentDate){
        console.log("Key is outdated, fetching new daily key");
        axios
            .get('https://www.ura.gov.sg/uraDataService/insertNewToken.action', {
                headers: {
                    'AccessKey': '406a0603-5173-44f5-b1d1-8135cffefd52'
                }
            })
            .then((response) => {
                dailyKey[0] = response["data"]["Result"]
                dailyKey[1] = currentDate;
                getData();
            })
    }
    else getData();
}

// Get Availability Data
function getData() {
    console.log("Fetching carpark availability...");
    axios.all([
        // LTA
        axios.get('http://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2', {
            headers: {
                'AccountKey': 'Hj3YzBxVTuGhFO/OhXDVJQ==',
                'accept': 'application/json'
            }
        }),
        // URA
        axios.get('https://www.ura.gov.sg/uraDataService/invokeUraDS?service=Car_Park_Availability', {
            headers: {
                'Accesskey': '406a0603-5173-44f5-b1d1-8135cffefd52',
                'Token': dailyKey[0]
            }
        }),
        // HDB
        axios.get('https://api.data.gov.sg/v1/transport/carpark-availability')
    ])
        .then((responseArr) => {
            console.log("Formatting results...")
            const resultObj = {};
            let key = '';
            let lotType = '';
            let availHeader = '';
            //format LTA response
            responseArr[0]['data']['value'].forEach((obj) => {
                key = "LTA" + "_" + obj['Development'].replace(/\s|\(|\)|&|\//g, "");
                switch(obj['LotType']){
                    case('C'):
                        availHeader = 'availableLots_car';
                        break;
                    case ('Y'):
                        availHeader = 'availableLots_motorcycle';
                        break;
                    default:
                        availHeader = 'availableLots_' + obj["LotType"];
                        break;
                }
                if (key in resultObj) resultObj[key][availHeader] = obj['AvailableLots'];
                else resultObj[key] = {[availHeader]: obj['AvailableLots']};
            });
            //format URA response
            responseArr[1]['data']['Result'].forEach((obj) => {
                switch(obj['lotType']){
                    case('C'):
                        lotType = 'car';
                        availHeader = 'availableLots_car';
                        break;
                    case ('M'):
                        lotType = 'motorcycle';
                        availHeader = 'availableLots_motorcycle';
                        break;
                    case('H'):
                        lotType = 'Heavy Vehicle';
                        availHeader = 'availableLots_' + obj["lotType"];
                        break;
                    default:
                        lotType = obj["LotType"];
                        availHeader = 'availableLots_' + obj["lotType"];
                        break;
                }
                Object.keys(oldData).forEach((key) => {
                    if (key.includes("URA_" + obj["carparkNo"])) {
                        if (key in resultObj) resultObj[key][availHeader] = Number(obj['lotsAvailable']);
                        else resultObj[key] = {[availHeader]: Number(obj['lotsAvailable'])}
                    }
                })
            })
            // format HDB response
            responseArr[2]['data']['items'][0]['carpark_data'].forEach((obj) => {
                key = "HDB" + "_" + obj["carpark_number"];
                resultObj[key] = {}
                obj['carpark_info'].forEach((availInfo) => {
                    switch(availInfo['lot_type']){
                        case('C'):
                            lotType = 'car';
                            break;
                        case ('Y'):
                            lotType = 'motorcycle';
                            break;
                        default:
                            lotType = availInfo["lot_type"];
                            break;
                    }
                    resultObj[key]["totalLots_"+lotType] = Number(availInfo['total_lots']);
                    resultObj[key]["availableLots_"+lotType] = Number(availInfo['lots_available']);
                })
            });
            availabilityData = resultObj;

            console.log("Checking availability data against database...")
            update()
        }, (error) => {
            console.log(error);
        })
}

// Compare and update availability data against database
function update() {
    console.log('Fetching updated data...');
    console.log('Data retrieved');
    console.log('Checking for new updates...')
    updateData = {};
    let oldObj = {};
    let updateFields = {};
    Object.keys(availabilityData).forEach((key) => {
        oldObj = oldData[key];
        updateFields = {};
        // If oldObj is undefined, key is not present in database, due to naming inconsistencies on from the API data
        if (oldObj) {
            Object.keys(availabilityData[key]).forEach((field) => {
                if (oldObj[field] !== availabilityData[key][field]) {
                    // database data is outdated
                    updateFields[field] = availabilityData[key][field];
                    // update oldData object so it can be reused in the next cycle
                    oldObj[field] = availabilityData[key][field];
                }
            })
        }
        if (Object.keys(updateFields).length !== 0) {
            updateData[key] = updateFields;
            /*
            console.log('Update found for ' + key);
            console.log(updateData[key]);
             */
        }
    })

    if (Object.keys(updateData).length === 0){
        console.log('No updates found')
    }
    else {
        /* Couldn't get this to work, maybe updating all at once not supported. It overrwrites instead of updating
        ref
            .update(updateData)
            .then(() => console.log('Database updated'))
            .catch((error) => {
                console.log('error adding document');
            })
         */
        Object.keys(updateData).forEach((key) => {
            ref = database.ref("/" + key);
            ref
                .update(updateData[key])
                .catch((error) => {
                    console.log('error adding data')
                });
        })
        console.log('Database updated');
    }

    console.log("Process complete, setting timeout for 60s");
    // subsequent runs will make use of the updated oldData file instead of querying the database
    setTimeout(checkDailyKey, INTERVAL);
}


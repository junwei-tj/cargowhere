import database from '@react-native-firebase/database';


const carparkData = {
    // Retrieves carpark data for carparks within [x1,y1] to [x2,y2]
    // Callback is required as querying is asynchronous
    retrieveInCoords: function(x1, y1, x2, y2, callback){

        database()
            .ref('/')
            .orderByChild('coordinates/x')
            .startAt(x1)
            .endAt(x2)
            .once("value", snapshot=>{
                const resultArray = []
                var carpark = snapshot.val()
                for (var key in carpark){
                    if (carpark[key]["coordinates"]["y"] >= y1 && carpark[key]["coordinates"]["y"] <= y2)
                        resultArray.push(carpark[key]);
                }
                callback(resultArray);
            })
    }
}

export default carparkData;
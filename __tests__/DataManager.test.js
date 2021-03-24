import DataManager from '../DataManager';

it('Gets static carpark data', async (done) => {
  function callback(data) {
    expect(data).not.toHaveLength(0);
    done();
  }
  DataManager.retrieveCarparkStaticData(callback);
}, 10000);

it('Returns carpark by coordinates', (done) => {
  var cp = {
    coordinates: {
      x: 1,
      y: 1,
    },
  };
  DataManager._carparksData.push(cp);
  function callback(data) {
    expect(data).toStrictEqual([cp]);
    done();
  }
  DataManager.retrieveInCoords(0, 0, 2, 2, callback);
});

it('Returns carpark by latlng', (done) => {
  var cp = {
    latitude: 1,
    longitude: 1,
  };
  DataManager._carparksData.push(cp);
  function callback(data) {
    expect(data).toStrictEqual([cp]);
    done();
  }
  DataManager.retrieveInLongLat(0, 0, 2, 2, callback);
});

it('Returns carpark by Name', (done) => {
  var cp = {
    identifier: 'Carpark',
  };
  DataManager._carparksData.push(cp);
  function callback(data) {
    expect(data).toStrictEqual([cp]);
    done();
  }
  DataManager.retrieveByName('Carpark', callback);
});

it('Gets availability data', (done) => {
  function callback(data) {
    expect(data).toBeDefined();
    done();
  }
  DataManager.retrieveAvailabilityData(callback);
});

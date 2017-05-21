// 4bf58dd8d48988d1e0931735,56aa371be4b08b9a8d5734c1,5665c7b9498e7d8a4f2c0f06,4bf58dd8d48988d16d941735,54135bf5e4b08f3d2429dfe7,4bf58dd8d48988d116941735
// venues/search?ll=30.271713,-97.745898&categoryId=4bf58dd8d48988d1e0931735,56aa371be4b08b9a8d5734c1,5665c7b9498e7d8a4f2c0f06,4bf58dd8d48988d16d941735,54135bf5e4b08f3d2429dfe7,4bf58dd8d48988d116941735&radius=4000

const request = require("request");
const location_data = require("../inventory").location_data;

const getVenues = (lat, lon, callback) => {
  const oauth = "PHF5HYQQGRCTATY0M0RDSDWENTFVY1O4X4AJB5MJH0L1LTCO";  
  request(`https://api.foursquare.com/v2/venues/search?ll=${lat},${lon}&categoryId=4bf58dd8d48988d1e0931735,56aa371be4b08b9a8d5734c1,5665c7b9498e7d8a4f2c0f06,4bf58dd8d48988d16d941735,54135bf5e4b08f3d2429dfe7,4bf58dd8d48988d116941735&radius=4000&oauth_token=${oauth}&v=20170521&_=1495388479535`, function (error, response, json) {
    if (!error) {
      callback(JSON.parse(json));
    } else {
      callback({});
    }
  });
};

const getVenuesNearBranch = (name, callback) => {
  
  const branch = location_data[name];
  if (branch) {
    const oauth = "PHF5HYQQGRCTATY0M0RDSDWENTFVY1O4X4AJB5MJH0L1LTCO";  
    request(`https://api.foursquare.com/v2/venues/search?ll=${branch.location.lat},${branch.location.lon}&categoryId=4bf58dd8d48988d1e0931735,56aa371be4b08b9a8d5734c1,5665c7b9498e7d8a4f2c0f06,4bf58dd8d48988d16d941735,54135bf5e4b08f3d2429dfe7,4bf58dd8d48988d116941735&radius=4000&oauth_token=${oauth}&v=20170521&_=1495388479535`, function (error, response, json) {
      if (!error) {
        callback(JSON.parse(json));
      } else {
        callback({});
      }
    });
  } else {
    callback({});
  }
  
};




module.exports = {
  getVenues,
  getVenuesNearBranch,
};
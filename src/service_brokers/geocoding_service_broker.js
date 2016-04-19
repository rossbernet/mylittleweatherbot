const config = require('../../config/app');
const request = require('request');

function getLatLong(loc, callBack){
  request(
    { url: config.google_maps_api.endpoint,
      qs: { address: loc,
          key: config.google_maps_api.key
    }
  }, function(err, response, body) {
        if(err) { console.log(err); return; }
        var parsed = JSON.parse(body);
        if(parsed.results.length <= 0) { console.log("Error: No results."); return;}
        var location = parsed.results[0].geometry.location
        callBack({latitude: location.lat,
                  longitude: location.lng});

});

}
module.exports.getLatLong = getLatLong;

const config = require('../../config/app');
const request = require('request');

function getForecast(loc, callBack){
  request(
    { url: config.forecast_api.endpoint +
       '/' + config.forecast_api.key + '/' +
       loc.latitude + ',' + loc.longitude
  }, function(err, response, body) {
        if(err) { console.log(err); return; }
        var parsed = JSON.parse(body);
        callBack(parsed.currently);

});
}
module.exports.getForecast = getForecast;

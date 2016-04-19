
'use strict';

// Quickstart example
// See https://wit.ai/l5t/Quickstart

// When not cloning the `node-wit` repo, replace the `require` like so:
// const Wit = require('node-wit').Wit;
const Wit = require('../').Wit;
const ForecastServiceBroker = require("./service_brokers/forecast_service_broker");
const GeocodingServiceBroker = require("./service_brokers/geocoding_service_broker");
const config = require("../config/app.js")

const token = (() => {
  return config.bot.key;
})();

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
  ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  say: (sessionId, context, message, cb) => {
    console.log(message);
    cb();
  },
  merge: (sessionId, context, entities, message, cb) => {
    // Retrieve the location entity and store it into a context field
    const loc = firstEntityValue(entities, 'location');
    if (loc) {
      context.loc = loc;
    }
    cb(context);
  },
  error: (sessionId, context, error) => {
    console.log(error.message);
  },
  'fetch-weather': (sessionId, context, cb) => {
      GeocodingServiceBroker.getLatLong(context.loc,
      (latlong) => ForecastServiceBroker.getForecast(latlong,
                        function(forecast){
                          context.forecast = forecast.summary.toLowerCase()+
                           " and " + forecast.temperature + " degrees";
                          cb(context)}
                        ));
  },
};

const client = new Wit(token, actions);
client.interactive();

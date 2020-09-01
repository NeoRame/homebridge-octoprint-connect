var got = require("got");
var Service, Characteristic;

module.exports = function(homebridge) {
  console.log("homebridge API version: " + homebridge.version);

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-octoprint-temp", "Octoprint-Temp", OctoprintAccessory);
};

function OctoprintAccessory(log, config, api) {
  this.log = log;
  this.name = config["name"];
  this.server = config["server"] || 'http://octopi.local';
  this.apiKey = config["api_key"];

  this.currentHeatingCoolingState = Characteristic.CurrentHeatingCoolingState.OFF;
  this.accessories = [];
  this.service = new Service.TemperatureSensor(this.name);

  //Required
  this.service
    .getCharacteristic(Characteristic.CurrentTemperature)
    .on('get', this.getCurrentTemperature.bind(this));

  //Optional
	this.service
		.getCharacteristic(Characteristic.Name)
		.on('get', this.getName.bind(this));
}

OctoprintAccessory.prototype.identify = function(callback) {
  //this.log('Identify requested');
  callback(null);
};

//Required
OctoprintAccessory.prototype.getCurrentTemperature = function(callback) {
//  this.log('Getting current temperature... GET ' + this.server + '/api/printer');

  var uri = this.server + '/api/printer';

  var options = {
    headers: {
      "X-Api-Key": this.apiKey
    },
  };

    (async () => {
      try {
        const response = await got(uri,options);
        const jsonResponse = JSON.parse(response.body);
        var currentTemperature =  jsonResponse.temperature.tool0.actual;
        callback(null, currentTemperature);
      } catch (error) {
        callback(error);
      }
    })();
};

//Optional
OctoprintAccessory.prototype.getName = function(callback) {
  callback(null, this.name);
};

OctoprintAccessory.prototype.getServices = function() {
  return [this.service];
};

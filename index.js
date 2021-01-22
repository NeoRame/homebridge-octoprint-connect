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
  this.debug = config["debug"];

  this.HotEndTempService = new Service.TemperatureSensor(this.name + ' Extruder', this.name + '1234');
  this.BedTempService = new Service.TemperatureSensor(this.name + ' Bed', this.name + '2468');

  //Required
  this.HotEndTempService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({
      minValue: 0,
      maxValue: 400
    })
    .on('get', this.getCurrentHotEndTemperature.bind(this));

    this.BedTempService
    .getCharacteristic(Characteristic.CurrentTemperature)
    .setProps({
      minValue: 0,
      maxValue: 200
    })
    .on('get', this.getCurrentBedTemperature.bind(this));

  //Optional
	this.HotEndTempService
		.getCharacteristic(Characteristic.Name)
    .on('get', this.getName.bind(this));
  
  	this.BedTempService
		.getCharacteristic(Characteristic.Name)
		.on('get', this.getName.bind(this));
  this.log('Initialized');
}

OctoprintAccessory.prototype.identify = function(callback) {
  if (this.debug) {
    this.log('Identify requested');
  }
  callback(null);
};

//Required
OctoprintAccessory.prototype.getCurrentHotEndTemperature = function(callback) {
  if (this.debug) {
    this.log('Getting current temperatures from ' + this.server + '/api/printer');
  }
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
        if (this.debug) {
	this.log('Error connecting: ' + error.message);
        }
        callback(error);
      }
    })();
};

OctoprintAccessory.prototype.getCurrentBedTemperature = function(callback) {
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
          var currentTemperature =  jsonResponse.temperature.bed.actual;
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
  return [this.HotEndTempService, this.BedTempService];
};

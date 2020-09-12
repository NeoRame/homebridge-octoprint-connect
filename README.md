# homebridge-octoprint-temp
 
## Purpose

I always wanted to see the heatbed and extruder temperature of my 3D-printer in Homekit. So here is the homebridge-octoprint connection plugin for that.

## Config

This plugin adds an accessory with two services, one for the extruder and one for the heatbed. In Homekit it will show up as one entity with two temperatures.

If you are using the Homebridge-UI config schema is supported.

To manually config the plugin add the following to your `config.json`. This is an example for a homebridge instance with a total of one accessory. If you have exisiting accessories you only need to add the part between `{}` to your accessories section.

```
"accessories": [
        {
            "accessory": "Octoprint-Temp",
            "name": "Your printer name",
            "server": "ip-address of your octoprint-server (if not specified by octopi.local)",
            "api_key": "Your octoprint api-key"
        }
    ]
```

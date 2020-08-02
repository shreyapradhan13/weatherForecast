
const express = require('express');
const request = require('request');
var path = require('path');

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public'))); // to access the public folder
app.use(express.json())
app.get('/nav.html', function (req, res) {        // to load nav bar
  res.sendFile(__dirname +'/views/nav.html');
})
app.get('/5-day', function (req, res) {           // api call for five day forecast
  res.sendFile(__dirname +'/views/five-day-forecast.html');
})
app.get('/', function (req, res) {
  res.sendFile(__dirname +'/views/index.html');   // app entry point index page
})
app.listen(3002, function () {
  console.log('Example app listening on port 3002!')  // listening on to port 3002 
})

const apiKey = '3ffc2c45a4e70b2e9989a3d85489fac6'; // pass the string value of apikey to a variable apikey

// to get the current temperature of the current location
app.get('/GetCurrentTemperature', function (req, res) { 
  console.log(req.query)
  let lat = req.query.lat; // get the latitude and pass it to variable lat
  let lon = req.query.lon; // get the longitude and pass it to variable lon
  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  // variable url is assigned the OpenWeatherMap url with required parameters: lat & lon (for geolocation), apikey and units(Fahrenheit)

  request(url, function (err, response, body) { // pass the url and request returns a callback function with three arguments err, response and body
    if(err){ // check for error if any and log it
      res.send({weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      console.log(weather) // if error free, log the contents of the response body
      if(weather.main == undefined){
        res.send( {weather: null, error: 'Error, please try again'}); // if response body is not correct
      } else {
        let weatherText = `It's ${weather.main.temp}F in ${weather.name}!`; // variable weatherText holds the current temp in current location
        res.send( {weather: weatherText, error: null}); 
      }
    }
  });
})
// to get a 3-hourly forecast for a period of 5 days
app.get('/Get5DayForecast', function (req, res) {
  console.log(req.query) 
  let lat = req.query.lat; // get the latitude and pass it to variable lat
  let lon = req.query.lon; // get the longitude and pass it to variable lon
  let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  // variable url is assigned the OpenWeatherMap url with required parameters: lat & lon (for geolocation), apikey and units(Fahrenheit)

request(url, function (err, response, body) {  // pass the url and request returns a callback function with three arguments err, response and body
    if(err){  // check for error if any and log it
      res.send({weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body) 

      var forecast = [];
      if(weather.main == undefined){
        weather.list.forEach((item, i) => { // for each list get the timestamp, temperature and the icon corresponding to weather condition
          var fcast = {
            date : '',
            temp: '',
            iconURI : ''
          }
          fcast.date = item.dt_txt;
          fcast.temp = item.main.temp;
          fcast.iconURI = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`; // url to get the OpenWeatherMap icon
          forecast.push(fcast)
        });
        console.log(forecast)
        res.send( forecast);
      } else {
        res.send({weather: null, error: 'Error, please try again'}); // if response body is wrong
      }
    }
  });
})

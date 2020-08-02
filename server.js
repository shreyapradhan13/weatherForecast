
const express = require('express');
const request = require('request');
var path = require('path');

const app = express()

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.get('/nav.html', function (req, res) {
  res.sendFile(__dirname +'/views/nav.html');
})
app.get('/5-day', function (req, res) {
  res.sendFile(__dirname +'/views/five-day-forecast.html');
})
app.get('/', function (req, res) {
  res.sendFile(__dirname +'/views/index.html');
})
app.listen(3002, function () {
  console.log('Example app listening on port 3002!')
})

const apiKey = '3ffc2c45a4e70b2e9989a3d85489fac6';

app.get('/GetCurrentTemperature', function (req, res) {
  console.log(req.query)
  let lat = req.query.lat;
  let lon = req.query.lon;
  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
request(url, function (err, response, body) {
    if(err){
      res.send({weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      console.log(weather)
      if(weather.main == undefined){
        res.send( {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp}F in ${weather.name}!`;
        res.send( {weather: weatherText, error: null});
      }
    }
  });
})

app.get('/Get5DayForecast', function (req, res) {
  console.log(req.query)
  let lat = req.query.lat;
  let lon = req.query.lon;
  let url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
request(url, function (err, response, body) {
    if(err){
      res.send({weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)

      var forecast = [];
      if(weather.main == undefined){
        weather.list.forEach((item, i) => {
          var fcast = {
            date : '',
            temp: '',
            iconURI : ''
          }
          fcast.date = item.dt_txt;
          fcast.temp = item.main.temp;
          fcast.iconURI = `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`;
          forecast.push(fcast)
        });
        console.log(forecast)
        res.send( forecast);
      } else {
        let weatherText = `It's ${weather.main.temp}F in ${weather.name}!`;
        res.send( {weather: weatherText, error: null});
      }
    }
  });
})

function getCurrentWeatherInfo() { // function to get the current temperature
    if (navigator.geolocation) {
      var pos = navigator.geolocation.getCurrentPosition(fetchTempData);
    } else {
      $('#weather-info').text("Geolocation is not supported by this browser.");
    }
  }
  
  function fetchTempData(pos){  // function to make server api call to get current temperature
  
    fetch('/GetCurrentTemperature?' + new URLSearchParams({
      "lat":pos.coords.latitude,
      "lon":pos.coords.longitude
  })).then(res => res.json() ).then(res => document.getElementById('weather-info').innerText = res.weather);
  }
  
  function get5DayForecastInfo() { // function to get the 5 day forecast data 
    if (navigator.geolocation) {
      var pos = navigator.geolocation.getCurrentPosition(fetchForecastData);
    } else {
      $('#weather-info').text("Geolocation is not supported by this browser.");
    }
  }
  
  function fetchForecastData(pos){ // ffunction to make server api call to get 5 day 3-hourly forecast
  
    fetch('/Get5DayForecast?' + new URLSearchParams({
      "lat":pos.coords.latitude,
      "lon":pos.coords.longitude
  })).then(res => res.json() ).then(res => updateTable(res));
  }
  
  function updateTable(jsonData){ // function to update the list in 3-hourly forecast for 5 day period 
  
    var table = $('#5-dayfcast tbody')
    $.each(jsonData, function(i, item) {
          var tr = "<tr>"
          tr = tr + "<td>"+item.date + "</td>"
          tr = tr + "<td>"+item.temp + "</td>"
          tr = tr + "<td>"+'<img src = '+item.iconURI+'>' + "</td>"
          tr = tr+ "</tr>"
  
          table.append(tr);
          
      });
  }
  
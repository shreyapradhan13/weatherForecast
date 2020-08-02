function getCurrentWeatherInfo() {
    if (navigator.geolocation) {
      var pos = navigator.geolocation.getCurrentPosition(fetchTempData);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function fetchTempData(pos){
  
    fetch('/GetCurrentTemperature?' + new URLSearchParams({
      "lat":pos.coords.latitude,
      "lon":pos.coords.longitude
  })).then(res => res.json() ).then(res => document.getElementById('weather-info').innerText = res.weather);
  }
  
  function get5DayForecastInfo() {
    if (navigator.geolocation) {
      var pos = navigator.geolocation.getCurrentPosition(fetchForecastData);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }
  
  function fetchForecastData(pos){
  
    fetch('/Get5DayForecast?' + new URLSearchParams({
      "lat":pos.coords.latitude,
      "lon":pos.coords.longitude
  })).then(res => res.json() ).then(res => updateTable(res));
  }
  
  function updateTable(jsonData){
  
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
  
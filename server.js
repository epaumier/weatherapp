const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');
const app = express()

//allows use of static files inside public folder
app.use(express.static('public'));

//by using body-parser we can make use of the req.body object
app.use(bodyParser.urlencoded({ extended: true }));

//allows use of the EJS templating language
app.set('view engine', 'ejs')

//Using res.render will render the ejs file
app.get('/', function (req, res) {
    res.render('index', {
      desc: null,
      sky: null,
      cityname: null,
      temp: null,
      error: null,
    });
  })

app.post('/', function (req, res) {
  let city = req.body.city;
  let APIKEY = 'a7b96c0a9b8ce0bf70a5cf2f8fbde1d5';
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=${APIKEY}`
  let mapurl = `https://tile.openweathermap.org/map/{layer}/{z}/{x}/{y}.png?appid=${APIKEY}`
    
  request(url, function (err, response, body) {
        if(err){
          res.render('index', {weather: null, error: 'Error, please try again'});
        } else {
          let weather = JSON.parse(body)
          if(weather.main == undefined){
            res.render('index', {weather: null, error: 'Error, please try again'});
          } else {
            let temperature = `${weather.main.temp}`;
            let weathericon = weather.weather[0].icon;
            let description = `${weather.weather[0].description}`;
            let icon = `http://openweathermap.org/img/w/${weathericon}.png`;
            let city = `${weather.name}`;           

            res.render(
              'index',
              {
                temp: temperature,
                cityname: city,
                sky: icon,
                desc: description,
                error: null
            });
          }
                
        }
  });
});

app.listen(3000, function () {
  console.log('Weather App listening on port 3000!')
})
const express = require("express");
const cors = require("cors");
const axios = require("axios")
const bodyParser = require("body-parser")

require("dotenv").config();
//env variables
const PORT = process.env['PORT'] || 8080;
const API_KEY = process.env['API_KEY'];
const API_KEY_PREV = process.env['API_KEY_PREV']

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

const BASE_URL = `https://api.openweathermap.org/data/2.5/weather`;

const cities  = [
  'Agra','Delhi','Jaipur','Bengaluru','Hyderabad','Chennai','Coimbatore','Cochin', 'Kanpur','Ahmedabad', 'Surat','Navi Mumbai','Bhubaneswar', 'Nagpur','Kozhikode','Hubli','Kolkata','Tirupati','Chandigarh','Shimla','Manali','Indore','Patna','Ranchi','Raipur','Allahabad','Mysore','Mangalore','Bhopal','Dhaka','Karachi',
]

app.get("/" , (req,res) => {
  res.json({"message" : `Weather information server started on ${PORT}`})
})

//at this route, weather info of cities is fetched from openweathermap api
app.get("/api/forecast", async (req,res) => {
  try{
    // for pagination , taken as query params
    let per_page = parseInt(req.query.per_page , 10);
    let  page = parseInt(req.query.page , 10);

    //storing current Weather data in an array
    let weatherDataOfIndianCities = [];
    
    for(let index =0 ; index < cities.length; index++){
      let { data }= await axios.get(`${BASE_URL}?q=${cities[index]}&appid=${API_KEY_PREV}&units=metric`);
      
      if(data.cod !==200 ) throw new Error("Sorry, couldn't be fetched");
      weatherDataOfIndianCities = [...weatherDataOfIndianCities , data];
    }
   res.json({"data" : weatherDataOfIndianCities, isSuccess : true , page })
  } catch(err){
    res.json({"isSuccess" : false});
    console.error(err)
  }
})
app.listen(PORT , () => {
  console.log(`Weather app running on ${PORT}`)
})

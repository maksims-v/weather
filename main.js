// import {FORM} from "./view.js";
import {format} from "date-fns";

const FORM = document.querySelector('form');
const temperatureNow = document.querySelector('.weather-now__temperature');
const city = document.querySelectorAll('.weather-title');
const favoriteCityList = document.querySelector('.favorite-city-list');
let favoriteCityListArray = [];
let setOfFavoritycity = new Set([]);
const addFavoriteCity = document.querySelector('.weather-now__btn');
const detailTemperature = document.querySelector('.detail-temperature');
const detailFeelsLike = document.querySelector('.detail-feels_like');
const detailWeather = document.querySelector('.detail-weather');
const detailSunrise = document.querySelector('.detail-sunrise');
const detailSunset = document.querySelector(".detail-sunset");


const WEATHERIMAGE = {
  WEATHER_NOW_IMAGE: document.querySelector('.weather-now__img'),
  WEATHER_FORECAST_IMAGE: document.querySelectorAll('.weather-forecast__img')
};


let cityToUpperCase;
let formValue;
let getDataFromLocalStorage;
let removeCity;
let removeTaskArray;


if (localStorage.length === 0){
  localStorage.setItem('favoriteList', JSON.stringify([...setOfFavoritycity]));
}else{
  getData(getCookie("city"));
  getDataFromLocalStorage = localStorage.getItem('favoriteList', setOfFavoritycity);
  favoriteCityListArray = JSON.parse(getDataFromLocalStorage);
  favoriteCityListArray.forEach((city) =>{
    setOfFavoritycity.add(city);
  });

  setOfFavoritycity.forEach((city) =>{
    favoriteCityList.innerHTML +=`<li class="city-list__item">
    <button class="city-list__item-btn">
    ${city}
    </button>
    <div class="remove_button">
      DELETE
    </div>
    </li>
    `;
  });
  
  removeCity = document.querySelectorAll('.remove_button');
  removeTaskArray = Array.prototype.slice.call(removeCity);

  removeTaskArray.forEach((city, i) =>{
    city.addEventListener('click', (e) =>{
    
      setOfFavoritycity.delete(e.target.parentNode.firstElementChild.innerText);
      e.target.parentNode.remove();
     
      removeTaskArray.splice(0,1);
      localStorage.setItem('favoriteList', JSON.stringify([...setOfFavoritycity]));
    });
  });
}




FORM.addEventListener('submit', (e) =>{
  
  e.preventDefault();
  formValue = document.querySelector(".search__input").value;


  document.cookie = `city=${formValue}; max-age=3600`;

  if (formValue){
    temperatureNow.innerHTML = '';

    getData(formValue);

    city.forEach((i) =>{
      i.innerHTML = '';
      i.innerHTML = cityToUpperCase;
    });
    

    FORM.reset();
  }
});



addFavoriteCity.addEventListener('click', (e) =>{
  
  e.preventDefault();
  favoriteCityList.innerHTML = '';

  if(setOfFavoritycity.size <= 6 && city[0].innerText.length != 0){
    setOfFavoritycity.add(cityToUpperCase);
    localStorage.setItem('favoriteList', JSON.stringify([...setOfFavoritycity]));
  }

  setOfFavoritycity.forEach((city) =>{
    favoriteCityList.innerHTML +=
    `<li class="city-list__item">
      <button class="city-list__item-btn">${city}</button>
      <div class="remove_button">DELETE</div>
    </li>`;
  });

  removeCity = document.querySelectorAll('.remove_button');
  removeTaskArray = Array.prototype.slice.call(removeCity);

  removeTaskArray.forEach((city, i) =>{
    city.addEventListener('click', (e) =>{
      e.target.parentNode.remove();
      setOfFavoritycity.delete(e.target.parentNode.firstElementChild.innerText);
      removeTaskArray.splice(0,1);
      localStorage.setItem('favoriteList', JSON.stringify([...setOfFavoritycity]));
    });
  });

});

favoriteCityList.addEventListener('click', (e) =>{
  if (e.target.className ==='city-list__item-btn'){
    temperatureNow.innerHTML = '';
    city.forEach((i) =>{
      i.innerHTML = e.target.innerText;
    });
    document.cookie = `city=${e.target.innerText}; max-age=3600`;
    getData(e.target.innerText);
  }
  
});



async function getData (cityInput){
  const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
  const serverUrlForecast = 'http://api.openweathermap.org/data/2.5/forecast';
  const apiKey = 'f660a2fb1e4bad108d6160b7f58c555f';
  const cityName = cityInput;
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}&units=metric`;
  const urlForecast = `${serverUrlForecast}?q=${cityName}&appid=${apiKey}&units=metric`;
  cityToUpperCase = cityName[0].toUpperCase() + cityName.substring(1);

  try {
      let response = await fetch(url);
      let data = await response.json();
      // console.log(await fetch(url));
      // console.log(response);

      temperatureNow.innerText = cityName;

      
      city.forEach((i) =>{
        i.innerHTML = '';
      });
      detailTemperature.innerText = '-';
      detailFeelsLike.innerText = '-';
      detailWeather.innerText = '-';
      detailSunrise.innerText = '-';
      detailSunset.innerText = '-';
      
    
      const getImgIcon = data.weather[0].icon;
      WEATHERIMAGE.WEATHER_NOW_IMAGE.src = `./img/02d.png`;
      WEATHERIMAGE.WEATHER_NOW_IMAGE.src = `./img/${getImgIcon}.png`;
    
      temperatureNow.innerHTML = `${Math.round(data.main.temp)}&#176`;
    
      city.forEach((i) =>{
        i.innerHTML = cityToUpperCase;
      });
      detailTemperature.innerText = `${Math.round(data.main.temp)}`;
      detailFeelsLike.innerText = `${Math.round(data.main.feels_like)}`;
      detailWeather.innerText = data.weather[0].main;


      let sunrise = format(new Date(data.sys.sunrise*1000), 'H:mm');
      let sunset = format(new Date(data.sys.sunset*1000), 'H:mm');
    
      detailSunrise.innerText = sunrise;
      detailSunset.innerText = sunset;
    
    } catch (err) {
      console.log(err)
    }
  
  

  fetch(urlForecast).then(response => response.json())
  .then((dataForecast) => {
    console.log(dataForecast)
    let forecastArr = [];
 
    const days = [
      'Воскресенье',
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота'
    ];

    const FORECAST_LIST = {
      FORECAST_DAY: document.querySelectorAll('.forecast_day'),
      FORECAST_MONTH: document.querySelectorAll('.forecast_month'),
      FORECAST_TEMPERATURE: document.querySelectorAll('.forecast_temperature'),
      FORECAST_FEELS_LIKE_TEMP: document.querySelectorAll('.forecast_feels_like_temp'),
      FORECAST_WEATHER: document.querySelectorAll('.forecast_weather')
    };


    dataForecast.list.forEach((item, i) =>{
      const forecast12clock = new Date(dataForecast.list[i].dt_txt).getHours();

      if(forecast12clock === 12){
        forecastArr.push(item);
      } 
    }); 
    
 
    forecastArr.forEach((item, i) =>{
      FORECAST_LIST.FORECAST_DAY[i].innerText = `${new Date(forecastArr[i].dt_txt).getDate()} `;
      FORECAST_LIST.FORECAST_MONTH[i].innerText = days[new Date(forecastArr[i].dt_txt).getDay()];
      FORECAST_LIST.FORECAST_TEMPERATURE[i].innerText = ` ${Math.round(forecastArr[i].main.temp)}`;
      FORECAST_LIST.FORECAST_FEELS_LIKE_TEMP[i].innerText = `${Math.round(forecastArr[i].main.feels_like)}`;
      FORECAST_LIST.FORECAST_WEATHER[i].innerText = forecastArr[i].weather[0].main;
      WEATHERIMAGE.WEATHER_FORECAST_IMAGE[i].src =`./img/${forecastArr[i].weather[0].icon}.png`;
    });

  });
}


function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
const apiKey = 'c1cc05219aaf07f2289681e011217fe5';
const searchBox = document.querySelector('.search-box');
const searchBtn= document.querySelector(".search-btn");

const weatherInfoSection=document.querySelector('.weather-info');
const notFoundSection=document.querySelector('.not-found');
const searchCitySection=document.querySelector('.search-city');

const countryTxt = document.querySelector('.country-txt')
const tempTxt = document.querySelector('.temp-txt')
const mainConditionTxt = document.querySelector('.main-condition-txt')
const currenDate=document.querySelector('.current-date')
const conditionTxt=document.querySelector('.condition-txt')
const humidityValue=document.querySelector('.humidity-value')
const windValue=document.querySelector('.wind-value')
const windDirection=document.querySelector('.wind-direction')
const weatherSummaryImg= document.querySelector('.weather-summary-img')

const forecastItemsContainer = document.querySelector('.forecast-item-container')

searchBtn.addEventListener('click', () =>{
    if (searchBox.value.trim() != ''){
        updateWeatherInfo(searchBox.value)
        searchBox.value=''
        searchBox.blur()
    }
    
})
searchBox.addEventListener('keydown',(event)=> {
    if (event.key == 'Enter' && searchBox.value.trim() != ''){
        updateWeatherInfo(searchBox.value)
        searchBox.value=''
        searchBox.blur()
    }
})
async function getFetchData(endPoint, city){
    const url = `http://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

    const response= await fetch(url)

    return response.json()
}
function getCurrentDate() {
    const currenDate = new Date()
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    return currenDate.toLocaleDateString('en-GB',options)
}
async function updateWeatherInfo (city){
    const weatherData = await getFetchData('weather',city)

    if(weatherData.cod != 200){
        showDisplaySection(notFoundSection)
        return
    }
    console.log(weatherData)

    const{
        name: enterCity,
        main: {temp, humidity},
        weather: {id, main, description},
        wind: {speed, deg},
    } = weatherData

    countryTxt.textContent = enterCity;
    tempTxt.textContent = Math.round(temp) + '°C';
    mainConditionTxt.textContent = main;
    conditionTxt.textContent = description; 
    humidityValue.textContent = humidity + '%';
    windValue.textContent = speed + 'M/s'

    currenDate.textContent=getCurrentDate()
    console.log(getCurrentDate())

    const iconUrl = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`;
    weatherSummaryImg.src = iconUrl;

    await updateForecastInfo(city)
    showDisplaySection(weatherInfoSection)
}
   async function updateForecastInfo(city) {
        const forecastsData = await getFetchData('forecast', city)
   

        const timeTaken ='12:00:00'
        const todayDate = new Date().toISOString().split('T')[0]
   
        forecastItemsContainer.innerHTML=''
        forecastsData.list.forEach(forecastWeather => {
            if (forecastWeather.dt_txt && forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
                updateForecastItems(forecastWeather)
            }
        } )
    }

        function updateForecastItems(weatherData){
            console.log(weatherData)
            const {
                dt_txt: date,
                weather:[{id }],
                main: {temp},
            } = weatherData

        const dateTaken = new Date(date)
        const dateOption = {
            day:'numeric',
            month: 'short'
        }
        const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)

        const forecastItem = `
        <div class="forecast-item" style="display: flex;">
            <h5 class="forecast-item-date">${dateResult}</h5>
            <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `;

            forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)

        
    }

    function showDisplaySection(section) {
        [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display='flex'
    }
    // Set Kathmandu as the default city on initial load
window.addEventListener('load', () => {
    updateWeatherInfo('Kathmandu');
});
const cityInput = document.querySelector('.city-input')
const btnFind = document.querySelector('.btn-find')


const countryTxt= document.querySelector('.location')
const tempTxt = document.querySelector('.num')
const conditionTxt = document.querySelector('.custom')
const humidityValuoTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const dayTxt = document.querySelector('.day')
const dateTxt = document.querySelector('.date')
const forecastItemContainer = document.querySelector('.forecast-item-container')




const apiKey = 'e5c112cc61e5c1dc0f38a1a24733e457'

btnFind.addEventListener('click', ()=> {
    if(cityInput.value.trim() != ''){
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
    
})
cityInput.addEventListener('keydown', (event) =>{
    if(event.key == 'Enter' && 
        cityInput.value.trim() != '' 
    ){
        updateWeatherInfo(cityInput.value)
        
        cityInput.value = ''
        cityInput.blur()  
    }
})

async function getFetchData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    return response.json();
}



function getWeatherIcon(id) {
    if (id <= 232) return 'icon-11.svg'
    if (id <= 321) return 'icon-9.svg'
    if (id <= 531) return 'icon-10.svg'
    if (id <= 622) return 'icon-13.svg'
    if (id <= 781) return 'icon-8.svg'
    else return 'icon-6.svg'
}

function getCurrentDate(){
    const currentDate = new Date()
    const options = {
        day : '2-digit',
        month : 'short'
    }
    return currentDate.toLocaleDateString('en-GB',options)
}
function getCurrentDay(){
    const currentDate = new Date()
    const options = {
        weekday : 'short'
        }
    return currentDate.toLocaleDateString('en-GB',options)
}



async function updateWeatherInfo(city) {
    try {
        const weatherDate = await getFetchData('weather', city);
        const {
            name: country,
            main: { temp, humidity },
            weather: [{ id, main }],
            wind: { speed }
        } = weatherDate;

        countryTxt.textContent = country;
        tempTxt.textContent = Math.round(temp) + '°C';
        conditionTxt.textContent = main;
        humidityValuoTxt.textContent = humidity + '%';
        windValueTxt.textContent = speed + ' km/h';

        dateTxt.textContent = getCurrentDate();
        dayTxt.textContent = getCurrentDay();

        weatherSummaryImg.src = `./images/${getWeatherIcon(id)}`;
    } catch (error) {
        console.error("Error updating weather info:", error.message);
    }
    await updateForecastInfo(city)
    
}
 
   



async function updateForecastInfo(city) {
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]

    forecastItemContainer.innerHTML = ''

    forecastsData.list.forEach(forecastWeather => {
        if(forecastWeather.dt_txt.includes(timeTaken) &&
            !forecastWeather.dt_txt.includes(todayDate)){
            updateForecastItem(forecastWeather) 
        }
     })
}

function updateForecastItem(weatherDate){
    console.log(weatherDate)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp,humidity }
       

    } = weatherDate

    const dateTaken = new Date(date)
    const dateOption = {
        day : '2-digit',
        month : 'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US',dateOption)

    const forecastItem = `
                    <div class="forecast">
                            <div class="forecast-header">
                                <div class="day">${dateResult}</div>
                            </div> 
                            <div class="forecast-content">
                                <div class="forecast-icon">
                                    <img src="images/${getWeatherIcon(id)}" alt="" width=48>
                                </div>
                                <div class="degree">${Math.round(temp)}<sup>o</sup>C</div>
                                
                            </div>
                            <div class="custom text-center p-3 text-info">${humidity}</div>
                    </div>
    
    `
    forecastItemContainer.insertAdjacentHTML('beforeend', forecastItem)

}

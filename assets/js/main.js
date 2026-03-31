import { debouncer } from "./utils.js";
import { getLocation, getWeatherData } from "./api.js";

document.getElementById('search-btn').addEventListener('click', async () => {
    
    const spinner = document.getElementsByClassName('loading-spinner')[0]
    const cityInput = document.getElementById("city-input")
    
    spinner.style.display = 'block'

    const cityName = document.getElementById('city-name')
    const cityDescription = document.getElementById('description')
    const cityTemp = document.getElementById('temp')
    const cityHumidity = document.getElementById('humidity')
    const cityWind = document.getElementById('wind')

    const location = await getLocation(cityInput.value)

    if(location){
        const weatherData = await getWeatherData(location.latitude, location.longitude)

        if(weatherData) {
            spinner.style.display = 'none'
            const temperatureUnits = weatherData.current_units.temperature_2m
            cityName.textContent = location.name
            cityDescription.textContent =  weatherData.timezone
            cityTemp.textContent = String(weatherData.current.temperature_2m) + temperatureUnits
            cityHumidity.textContent = String(weatherData.current.relative_humidity_2m)
            cityWind.textContent = String(weatherData.current.relative_humidity_2m)
        }
    }
    
})
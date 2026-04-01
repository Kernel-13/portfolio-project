import { debouncer } from "./utils.js";
import { getLocation, getWeatherData, WMO_WEATHER_CODES } from "./api.js";

document.getElementById('search-btn').addEventListener('click', async () => {
    
    const spinner = document.getElementsByClassName('loading-spinner')[0]
    const cityInput = document.getElementById("city-input")
    const forecastGrid = document.getElementById('forecast-container')
    
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
            cityDescription.textContent =  WMO_WEATHER_CODES[weatherData.current.weather_code] ?? 'Unknown description'
            cityTemp.textContent = String(weatherData.current.temperature_2m) + temperatureUnits
            cityHumidity.textContent = String(weatherData.current.relative_humidity_2m)
            cityWind.textContent = String(weatherData.current.wind_speed_10m)

            const forecastInfo = weatherData.daily
            console.log(forecastInfo)
            const forcastLength = forecastInfo.time.length
            const fragmentDoc = new DocumentFragment()
            forecastGrid.innerHTML = ''

            for (let i = 0; i < forcastLength; i++) {
                let forecastDate = new Date(forecastInfo.time[i])

                let formattedDate = forecastDate.toLocaleDateString("en-US", {
                    weekday: "short",
                    day: "numeric",
                    month: "short"
                })

                let template = document.createElement('template')

                template.innerHTML = `
                <div class="forecast-card">
                    <p class="forecast-date">${formattedDate}</p>
                    <i alt="Weather Icon" class="wi wi-wmo4680-${forecastInfo.weather_code[i]}"></i>
                    <div class="forecast-temps">
                        <span class="high">${forecastInfo.temperature_2m_max[i]}°C</span>
                        <span class="low">${forecastInfo.temperature_2m_min[i]}°C</span>
                    </div>
                    <p class="forecast-desc">${WMO_WEATHER_CODES[forecastInfo.weather_code[i]]}</p>
                </div>
                `.trim()
                
                fragmentDoc.append(template.content)
            }

           forecastGrid.append(fragmentDoc)

        }
    }
    
})
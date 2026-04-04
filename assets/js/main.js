import { debouncer } from "./utils.js";
import { getLocation, getWeatherData, WMO_WEATHER_CODES } from "./api.js";
const suggestionList = document.getElementById('suggestions-list')
const cityInput = document.getElementById('city-input')
const spinner = document.getElementById('loader')

async function searchLocation(input) {
    const locationArray = await getLocation(input)
    
    if (!locationArray) {
        /* Should render error message */
        suggestionList.style.display = 'none'
        return
    }

    suggestionList.innerHTML = ''
    for (const location of locationArray) {
        let listItem = document.createElement('li')
        listItem.classList.add('suggestion-item')
        listItem.dataset.latitude = location.latitude
        listItem.dataset.longitude = location.longitude
        listItem.dataset.city = location.name
        listItem.append(`${location.name}, ${location.admin1}, ${location.country}`)
        suggestionList.append(listItem)
    }
    suggestionList.style.display = 'block'
}

function renderCurrentWeather(weatherData, city){
    const cityName = document.getElementById('city-name')
    const cityDescription = document.getElementById('description')
    const cityTemp = document.getElementById('temp')
    const cityHumidity = document.getElementById('humidity')
    const cityWind = document.getElementById('wind')

    const temperatureUnits = weatherData.current_units.temperature_2m

    cityName.textContent = city
    cityDescription.textContent =  WMO_WEATHER_CODES[weatherData.current.weather_code] ?? '--'
    cityTemp.textContent = String(weatherData.current.temperature_2m) + temperatureUnits
    cityHumidity.textContent = String(weatherData.current.relative_humidity_2m)
    cityWind.textContent = String(weatherData.current.wind_speed_10m)
}

function renderWeeklyForecast(forecastInfo) {
    const forecastGrid = document.getElementById('forecast-container')
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

async function processAndRender(latitude, longitude, city) {
	spinner.style.display = 'block'
	const weatherData = await getWeatherData(latitude, longitude)

	if(weatherData) {
		renderCurrentWeather(weatherData, city)
		renderWeeklyForecast(weatherData.daily)
		spinner.style.display = 'none'
	}
}

const debouncedSearch = debouncer(searchLocation, 300)
cityInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value)
})

suggestionList.addEventListener('click', async (e) => {
    const listNode = e.target.closest('li')

    if (listNode && suggestionList.contains(listNode)) {
        cityInput.value = ''
        suggestionList.style.display = 'none'
        await processAndRender(listNode.dataset.latitude, listNode.dataset.longitude, listNode.dataset.city)

		const searchParams = new URLSearchParams()
        searchParams.append('cityName', listNode.dataset.city)
        searchParams.append('latitude', listNode.dataset.latitude)
        searchParams.append('longitude', listNode.dataset.longitude)
        history.replaceState('', '', location.origin + location.pathname + '?' + searchParams.toString())
    }
})

window.addEventListener('load', async () => {
	if (location.search === '') {
		return
	} 

	const params = new URLSearchParams(location.search)
	if (params.has('cityName') && params.has('latitude') && params.has('longitude')) {
		await processAndRender(params.get('latitude'), params.get('longitude'), params.get('cityName'))
	}

})
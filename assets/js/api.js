export async function getLocation(city) {
    try {
        let response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`)
        if (!response.ok) {
            console.error('Error: Geocoding Server is not returning the expected response')
            return
        }

        let data = await response.json()
        return data.results[0]
    } catch (error) {
        console.error(error)        
    }
    
}

/*
export async function getLocationTwo(event) {

    const input = event.target.value
    if (input.length < 3) {
        return
    }

    try {
        let response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input}&count=10&language=en&format=json`)
        if (!response.ok) {
            console.error('Error: Geocoding Server is not returning the expected response')
            return
        }

        let data = response.json()
        return data
    } catch (error) {
        console.error(error)        
    }
    
}*/

export async function getWeatherData(lat, lon) {
    try {
        let response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lat, lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`)
        if (!response.ok) {
            console.error('Error: Open-Meteo Server is not returning the expected response')
            return
        }

        let data = response.json()
        return data
    } catch (error) {
        console.error(error)        
    }
}
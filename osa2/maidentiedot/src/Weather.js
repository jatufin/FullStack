/* Using openwetahermap.org data */
/* API key in env variable REACT_APP_OPENWEATHERMAP_API_KEY */

import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Weather = ({city, country}) => {
    const [weather, setWeather] = useState([])

    useEffect(() => {
        const APIkey =  process.env.REACT_APP_OPENWEATHERMAP_API_KEY
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${APIkey}`
        return(
            axios
                .get(url)
                .then(response =>
                    setWeather(response.data))
        )
    }, [city, country])

    return(
        <div>
        <h2>Weather in {city}</h2>
        <p><b>temperature:</b> {weather.main ? (weather.main.temp - 273.15).toFixed(1) : "-"} Celsius</p>
        <p><b>wind:</b> {weather.wind ? weather.wind.speed : "-"} m/s {weather.wind ? weather.wind.deg : "-"} degrees</p>
        </div>
    )
}

export default Weather
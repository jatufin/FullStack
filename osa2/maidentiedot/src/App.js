import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './CountryList'


const App = () => {
  const [countries , setCountries] = useState([])
  const [filter, setFilter] = useState("")

  const filteredCountries = countries.filter(country =>
    country.name.toUpperCase().includes(filter.toUpperCase())
  )

  useEffect(() => {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then(response =>
        setCountries(response.data))
  }, [])

  const filterChange = (event) => {
    setFilter(event.target.value)
  }
  
  return (
    <div>
      <input
        value={filter}
        onChange={filterChange}
      />
      <CountryList
        countries={filteredCountries}
        selectAction={setFilter}
      />
    </div>
  )
}

export default App
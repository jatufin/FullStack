const CountryList = ({countries, selectAction}) => {
    const selectCountry = (countryName) => {
      return () => selectAction(countryName)
    }
    
    if(countries.length === 0) {
      return(
        <div>
          <p>No countries found</p>
        </div>
      )
    }
    if(countries.length > 10) {
      return(
        <div>
          <p>Too many matches, specify another filter</p>
        </div>
      )
    }
    
    if(countries.length > 1) {
      return(
        <div>
          {countries.map(country =>
            <p key={country.alpha3Code}>{country.name}
              <button onClick={selectCountry(country.name)}>show</button>
            </p>
          )}
        </div>
      )
    }
  
    return(
      <div>
        <CountryInfo country={countries[0]} />
      </div>
    )
  }
  
  const CountryInfo = ({country}) => {
    return(
      <div>
        <h1>{country.name}</h1>
          <p>capital {country.capital}</p>
          <p>population {country.population}</p>
          <h2>languages</h2>
            <ul>
              {country.languages.map(language =>
                <li key={language.iso639_2}>{language.name}</li>
              )}
            </ul>
          <img src={country.flag} alt="flag" width="150" />
      </div>
    )
  }

  export default CountryList
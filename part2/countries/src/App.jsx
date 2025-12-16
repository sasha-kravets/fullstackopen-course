import { useEffect, useState } from "react"
import axios from 'axios'

const api_key = import.meta.env.VITE_OPENWEATHERMAP_KEY

const WeatherDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  const capital = country.capital[0]

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.error('Error fetching weather:', error)
      })
  }, [capital])

  if (!weather) {
    return <p>Loading weather data...</p>
  }

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={`Weather in ${capital}`}
      />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  const languages = Object.values(country.languages)

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital {country.capital.join(', ')}</p>
      <p>Area {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {languages.map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
      />
      <WeatherDetails country={country} />
    </div>
  )
}

const CountryList = ({ countries, onShow }) => {
  return (
    <div>
      {countries.map(country => (
        <div key={country.cca3}>
          {country.name.common}
          <button onClick={() => onShow(country)}>Show</button>
        </div>
      ))}
    </div>
  )
}

const Countries = ({ filteredCountries, selectedCountry, onShow }) => {
  if (selectedCountry) {
    return <CountryDetails country={selectedCountry} />
  }

  if (filteredCountries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (filteredCountries.length > 1) {
    return <CountryList countries={filteredCountries} onShow={onShow} />
  }

  if (filteredCountries.length === 1) {
    return <CountryDetails country={filteredCountries[0]} />
  }

  return <p>No countries found</p>
}

function App() {
  const [countries, setCountries] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching countries:', error)
      })
  }, [])

  if (!countries) {
    return <p>Loading countries...</p>
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null);
  }

  let filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const handleShow = (country) => {
    setSelectedCountry(country)
  }

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />

      {search === ''
        ? <p>Enter a country name to search</p>
        : <Countries
          filteredCountries={filteredCountries}
          selectedCountry={selectedCountry}
          onShow={handleShow}
        />}
    </div>
  )
}

export default App

import { useState, useEffect } from 'react'
import axios from 'axios'
import Country from './components/Country'
import Notification from './components/Notification'
import countryService from './services/countries'

const App = () => {
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    countryService.getAll()
    .then(initialCountries => {
      console.log(initialCountries);
      setCountries(initialCountries);
    })
  }, [])

  const handleNameFilter = (event) => {
    setFilterName(event.target.value)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = countries 
  ? countries.filter(country => country && country.name.common.toLowerCase().startsWith(filterName.toLowerCase()))
  : []



  if (selectedCountry) {
    return (
      <div>
        <h1>{selectedCountry.name.common}</h1>
        <p>Capital: {selectedCountry.capital[0]}</p>
        <p>Area: {selectedCountry.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(selectedCountry.languages).map((language, index) => <li key={index}>{language}</li>)}
        </ul>
        <img src={selectedCountry.flags.png} alt="Flag of selected country" />
        <button onClick={() => setSelectedCountry(null)}>Back to list</button>
      </div>
    )
  }

  return (
    <div>
      <form>
        Find Country
        <input value={filterName} onChange={handleNameFilter}/>
      </form>
      <h1>Countries</h1>
      {countriesToShow.map(country => (
        <Country key={country.cca3} country={country} showCountry={() => showCountry(country)} />
      ))}
    </div>
  )
}

export default App

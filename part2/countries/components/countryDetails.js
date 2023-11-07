const CountryDetails = ({ country }) => {
    return (
      <div>
        <h1>{country.name.common}</h1>
        <h3>Capital: {country.capital[0]}</h3>
        <h3>Area: {country.area} km²</h3>
        <h3>Languages:</h3>
        <ul>
          {Object.values(country.languages).map(language => <li>{language}</li>)}
        </ul>
        <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      </div>
    )
  }
  
  export default CountryDetails
  
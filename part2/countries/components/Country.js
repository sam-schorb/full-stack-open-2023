const Country = ({ country, showCountry }) => {
  return (
    <li>
      {country.name.common}
      <button onClick={showCountry}>show</button>
    </li>
  )
}

export default Country

import { useState } from 'react'

const Statistics = ( { total, good, bad, neutral } ) => {
  if(total === 0) 
  return ( <p>No statistics yet</p> )
  else return (
    <div>
      <tr>
        <td>Good:</td>
        <td>{good}</td>
      </tr>
      <tr>
        <td>Neutral</td>
        <td>{neutral}</td>
      </tr>
      <tr>
        <td>Bad</td>
        <td>{bad}</td>
      </tr>
      <tr>
        <td>All</td>
        <td>{total}</td>
      </tr>
      <tr>
        <td>Average</td>
        <td>{((good + (bad * -1))/total).toFixed(2)}</td>
      </tr>
      <tr>
        <td>Positive</td>
        <td>{(good/total).toFixed(2)}</td>
      </tr>
    </div>
  )}

const Button = (props) => { 
  return <button onClick={props.handleClick}>{props.text}</button>
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)


  return (

    <div>
    <h1>give feedback</h1>
      <Button handleClick={() => {
        setAll(allClicks.concat('L'));
        setGood(good + 1); 
        setTotal(total + 1)
      }} text="Good" />

      <Button handleClick={() => {
        setAll(allClicks.concat('L'));
        setNeutral(neutral + 1); 
        setTotal(total + 1)
      }} text="Neutral" />

      <Button handleClick={() => {
        setAll(allClicks.concat('L'));
        setBad(bad + 1); 
        setTotal(total + 1)
      }} text="Bad" />

      < br />
      <h1>statistics</h1>

      <Statistics total={total} good={good} neutral={neutral} bad={bad}/>
      
    </div>
  )
}

export default App
import { useState, useEffect } from "react"

const Display = ( {counter} ) =>  (
    <>
      <p>{counter}</p>
      <p>{counter * counter}</p>
      <p>{counter * counter * counter}</p>
    </>
  )

const Button = ({ action, text }) => (
    <button onClick={action}>{text}</button>
  )

const Form = ({ inputValue, handleInputChange, handleSubmit }) => (
    <form onSubmit={handleSubmit}>
      <label htmlFor="label">INPUT:</label>
      <input type="text" id="label" name="label" value={inputValue} onChange={handleInputChange} /><br />
      <input type="submit" value="Submit" />
    </form>
  )

const Label = ({ label }) => (
    <p>{label}</p>
  )


const App = () => {
  const [ counter, setCounter ] = useState(0)
  const [ inputValue, setInputValue ] = useState('')
  const [ label, setLabel ] = useState('')

  const resetClock = () => { console.log('Reset'); setCounter(0) }
  const incrementClock = () => { console.log('Plus'); setCounter(counter + 1) }
  const decrementClock = () => { console.log('Minus'); setCounter(counter - 1) }
  const hundred = () => { console.log('Set to 100'); setCounter(100) }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setLabel(inputValue);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prevCounter) => prevCounter + 1)
    }, 1000)
    
    // Cleanup function
    return () => clearInterval(timer)
  }, [])

  console.log('rendering...', counter)

  return (
    <div>
      <Form inputValue={inputValue} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      <Label label={label} />
      <Button action={resetClock} text={'Reset'} />
      <Button action={incrementClock} text={'Plus'} />
      <Button action={decrementClock} text={'Minus'} />
      <Button action={hundred} text={'100'} />
      <Display counter={counter} />
    </div>
  )
}

export default App

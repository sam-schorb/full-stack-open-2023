import { useState, useEffect } from 'react'
import Person from './components/Person'
import Notification from './components/Notification'
import personService from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('enter name...')
  const [newNumber, setNewNumber] = useState('enter number...')
  const [filterName, setFilterName] = useState('')
  const [addedMessage, setAddedMessage] = useState(null) // new state variable


  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])
  

  const checkPerson = (event) => {
    event.preventDefault();
  
    const person = persons.find(p => p.name === newName);
    if (person) {
      const confirmUpdate = window.confirm(`${newName} is already added to the phonebook, would you like to replace the number with a new one?`);
      if (confirmUpdate) {
        replaceNumber(newName);
      }
    } else { 
      addPerson(event);
    }
  }
  

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    }
  
    personService
    .create(personObject)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setNewName('enter name...')
      setNewNumber('enter number...')
      
      // set the message
      setAddedMessage(`Added ${returnedPerson.name}`)
      
      // clear the message after 5 seconds
      setTimeout(() => {
        setAddedMessage(null)
      }, 5000)
    })
    .catch(error => {
      const errorMessage = error.response && error.response.data
        ? error.response.data.error // <--- Extract the error message from the response
        : error.message;  // fall back to the general error message if not
      
      console.error(errorMessage)
      console.error(error.reponse)
      console.error(error.message)
      
      // set the error message
      setAddedMessage(errorMessage) // Set the error message to state
      
      // clear the message after 5 seconds
      setTimeout(() => {
        setAddedMessage(null)
      }, 5000)
    })
  
  }
  
  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id);
    
    if (!person) {
      console.log('Person not found');
      return;
    }
    
    personService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setAddedMessage(`${person.name} has been deleted.`);
        setTimeout(() => {
          setAddedMessage(null)
        }, 5000);
      })
      .catch(error => {
        setAddedMessage(`${person.name} was already deleted from server`)
        setPersons(persons.filter(n => n.id !== id))
        setTimeout(() => {
          setAddedMessage(null)
        }, 5000);
      })
  }
  

  const replaceNumber = (name) => {
    const person = persons.find(p => p.name === name);
    if (person) {
      const updatedPerson = { ...person, number: newNumber };
  
      personService
        .update(person.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson));
          setNewNumber('enter number...');
        });
    }
  }
  


  

  const handleNameChange = (event) => {
    console.log(event.target.value);
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value);
    setNewNumber(event.target.value)
  }

  const handleClearPersonForm = (event) => {
    console.log('form clicked');
    setNewName('')
  }

  const handleClearNumberForm = (event) => {
    console.log('form clicked');
    setNewNumber('')
  }

  const handleNameFilter = (event) => {
    setFilterName(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().startsWith(filterName.toLowerCase())
  )
  

  return (
    <div>
      <h1>Phone Book</h1>
      <Notification message={addedMessage} />
      <form>
        Filter by
        <input value={filterName} onChange={handleNameFilter}/>
      </form>
      <h1>Add New</h1>
      <form onSubmit={checkPerson}>
        <input value={newName} onClick={handleClearPersonForm} onChange={handleNameChange}/>
        <input value={newNumber} onClick={handleClearNumberForm} onChange={handleNumberChange}/>
        <button type='submit'>save</button>
      </form>
      <h1>Numbers</h1>
        {personsToShow.map(person => (
        <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id)} />
      ))}
    </div>
  )
}

export default App
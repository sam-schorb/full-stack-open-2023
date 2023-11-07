import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import axios from 'axios'
import noteService from './services/notes'

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2022</em>
    </div>
  )
}

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('enter note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])



  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        //setNotes(notes.filter(n => n.id !== id))
      })
  }
  
  

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const handleClearForm = (event) => {
    console.log('form clicked');
    setNewNote('')
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
          {notesToShow.map(note => 
            <Note 
              key={note.id} 
              note={note}
              toggleImportance={() => toggleImportanceOf(note.id)}
            />
          )}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onClick={handleClearForm} onChange={handleNoteChange}/>
        <button type='submit'>save</button>
      </form>
<Footer />
    </div>
  )
}

export default App
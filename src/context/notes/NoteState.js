import NoteContext from "./noteContext";
import { useState } from "react";
const NoteState = (props) => {
  const host = 'http://localhost:5000'
  const notesIntial = []

  const [notes, setNotes] = useState(notesIntial)
  // //Add a note
  const addNote = async (title, description, tag) => {
    // TODO: API Call
    console.log("Adding a new note")
    const response = await fetch(`${host}/api/notes/addNotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNGY2MjI0ZWVjMDEwZGZkNTllZThlIn0sImlhdCI6MTY4ODYxNjIwNn0.dpkK_KzuxDjIfZPTeMOthwzzXgF6gnchlySoNrjmmXs"


      },
      body: JSON.stringify({ title, description, tag })
    });
   
    const note = await response.json() 
    setNotes(notes.concat(note))
  }
  const getNotes = async () => {
    // API Call 
    const response = await fetch(`${host}/api/notes/fetchallNotes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')

        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNGY2MjI0ZWVjMDEwZGZkNTllZThlIn0sImlhdCI6MTY4ODYxNjIwNn0.dpkK_KzuxDjIfZPTeMOthwzzXgF6gnchlySoNrjmmXs"
      }
    });
    const json = await response.json() 
    console.log(json)
    setNotes(json)
  }


  // Delete a Note
  const deleteNote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')

        // "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNGY2MjI0ZWVjMDEwZGZkNTllZThlIn0sImlhdCI6MTY4ODYxNjIwNn0.dpkK_KzuxDjIfZPTeMOthwzzXgF6gnchlySoNrjmmXs"

      }
    });
    const json = response.json();
    console.log(json);
    console.log("Deleting Item with id :" + id)
    const newNote = notes.filter((note) => { return note._id !== id });
    setNotes(newNote)
  }
  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')

        // "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjRhNGY2MjI0ZWVjMDEwZGZkNTllZThlIn0sImlhdCI6MTY4ODYxNjIwNn0.dpkK_KzuxDjIfZPTeMOthwzzXgF6gnchlySoNrjmmXs"

      },
      body: JSON.stringify({ title, description, tag })
    });
    // const json = response.json();
    let newNotes=JSON.parse(JSON.stringify(notes))
    for (let i = 0; i < notes.length; i++) {
      const element = newNotes[i];
      if (element._id === id) {
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }


  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;
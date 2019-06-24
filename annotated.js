import express from 'express';
import cors from 'cors';
const app = express();
const uuidv4 = require('uuid/v4');
app.use(cors())
app.use(express.json());

app.locals.notes = [
  { 
    title: 'randomnote', 
    id: '1', 
    listItems: [
      { id: '1', body: 'asdf', completed: false }
    ]
  },
  { 
    title: 'randomnoteTWO', 
    id: '2', 
    listItems: [
      { id: '2', body: 'asdf', completed: false }                           
    ]
  }
];
// app.locals is a variable that is given to us through express 

// here we are setting up some mock notes to work with 






app.get('/api/v1/notes', (request, response) => {
  const notes = app.locals.notes
  return response.status(200).json({ notes })
});

//We are using the GET method to grab all of our notes 

//the first argument we are using is the path of where to find our notes '/api/v1/notes'

//the second argument is a callback function (the handler which contains logic for how the request should be dealt with and what kind of response it should return), where we will eventually return a status of 200 (OK) and the actual notes 




app.post('/api/v1/notes', (request, response) => {
  const id = uuidv4();
  const {listItems, title} = request.body
  if(!listItems || !title) return response.status(422).json('Please provide a title and a list item.')
  const newNote = {
    id,
    ...request.body
  }
  app.locals.notes.push(newNote);
  response.status(201).json(newNote);

})

// Using the POST method to send a new note to our backend

// Our path is where were  posting the notes to '/api/v1/notes

// Inside our handler, we are giving the note we want to post an id using uuidv4 

// We are destructring listItems and title off of the request.body

// We have a conditional checking to see if the user did not provide either a listItem or title

// If user is missing one of the two, or both, we are sending a 422 response status and a message to the use instructing them to provie a title and a list item.

// We are declaring a constant, newNote,  which is  an object with the new id we have given it, and we are spreading in the body

// On line 55 we are pushing the new note into our app.locals.notes array and then sending a response of 201 (Success, and new resource created) and returning the newNote





app.delete('/api/v1/notes/:id', (request, response) => {
  const id = request.params.id;
  const newNotes = app.locals.notes.filter(note => note.id !== id);
  if (newNotes.length !== app.locals.notes.length) {
    app.locals.notes = newNotes
    return response.sendStatus(204);
  } else {
    return response.status(404).json({ error: 'No notes found'})
  }
})


// Here we are using the DELETE method where we are deleting an individual note. Our path is now followed by /:id which lets us isolate a single note

// We are using the id off of the request.params.id

// We set a constant, newNotes, we then filter through our app.locals.notes to find a noteID we are trying to delete and filter it out

// if the length of the newNotes array is not the same as app.locals.notes then set app.locals.notes to newNotes (newNotes has all of the notes except the one that was deleted)

// We then send a status of 204 (there is no content to send for this request)

// if newNotes and app.locals.notes are the same length, we give a status of 404 (not found) and notify user  with an error 'No notes found'






app.get('/api/v1/notes/:id', (request, response) => {
  const id = request.params.id;
  const note = app.locals.notes.find(note => note.id === id);
  if (!note) {
    return response.status(404).json({ error: 'No notes found'})
  }
  return response.status(200).json(note);
})


// Here we are grabbing a specific note using the GET method

// We are itterating through app.locals to find the note  we are looking for 

// If we dont find a note, return the response status of 404 (not found) and notify user "No notes found"

// If we find the note return 200 and the stringified note







app.put('/api/v1/notes/:id', (request, response) => {
  const { title, listItems } = request.body;
  const id = request.params.id;
  let noteWasFound = false;
  const updatedNotes = app.locals.notes.map(note => {
    if (note.id === id)  {
      noteWasFound = true;
      return { title: title || note.title, listItems: listItems || note.listItems, id: note.id }
    } else {
      return note
    }
  });

  if (!noteWasFound) {
    return response.status(404).json('No note found')
  }

  app.locals.notes = updatedNotes;
  return response.status(202).json('Successfully edited note');
})


// We are editing a note using the PUT method 
// Deconstructing title and listItems, grabbing id from the request.params.id, declaring a let variable notWasFound to false
// We then map over app.locals.notes. If the id matches, we reassign notWasFound to true and return the new object
// For all those that do not match, just return the original note 
// To handle our response, we set a conditional, if !noteWasFound, return a 404 status 'No Note Found'
// Finally, we set app.locals.notes to updatedNotes, and return a 202 status and a message, "Successfully edited note"









export default app;
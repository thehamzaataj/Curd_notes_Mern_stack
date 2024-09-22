import React, { useState, useEffect } from 'react';
import Navbar from './Navbar/Navbar';
import NoteCard from '../Components/Card/NoteCard';
import { MdAdd } from 'react-icons/md';
import AddEditNotes from './AddEditNotes';
import Modal from 'react-modal';

const Home = () => {
  const [openEditModel, setOpenEditModel] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [notes, setNotes] = useState([]); 

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const token = localStorage.getItem('token'); // Ensure this key matches your storage key
    if (!token) {
      console.error('No access token found');
      return; // Handle no token case
    }

    try {
      const response = await fetch(`http://localhost:3000/notes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Log the error response
        console.error('Fetch notes error:', errorData);
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notes', error);
    }
  };

  const addNote = async (noteData) => {
    const token = localStorage.getItem('token'); 

    try {
      const response = await fetch(`http://localhost:3000/add-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Log error response
        console.error('Add note error:', errorData);
        throw new Error(`Error: ${response.status}`);
      }

      const newNote = await response.json();
      setNotes(prevNotes => [...prevNotes, newNote.note]);
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const editNote = async (noteData) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:3000/update-notes/${noteData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Log error response
        console.error('Edit note error:', errorData);
        throw new Error(`Error: ${response.status}`);
      }

      const updatedNote = await response.json();
      setNotes(prevNotes => prevNotes.map(note => note._id === updatedNote.note._id ? updatedNote.note : note));
      setOpenEditModel({ isShown: false });
    } catch (error) {
      console.error('Error editing note', error);
    }
  };

  const deleteNote = async (noteId) => {
    const token = localStorage.getItem('token');

    try {
      await fetch(`http://localhost:3000/delete-notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
    } catch (error) {
      console.error('Error deleting note', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className='container mx-auto'>
        <div className="grid grid-cols-3 gap-4 mt-8 mx-8">
          {notes.map(note => (
            <NoteCard
              key={note._id}
              title={note.title}
              date={note.date}
              content={note.content}
              tags={note.tags}
              isPinned={note.isPinned}
              onEdit={() => setOpenEditModel({ isShown: true, type: 'edit', data: note })}
              onDelete={() => deleteNote(note._id)}
            />
          ))}
        </div>
      </div>
      <button
        className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-700 hover:bg-blue-800 absolute right-10 bottom-10'
        onClick={() => setOpenEditModel({ isShown: true, type: "add", data: null })}
      >
        <MdAdd className='text-[32px] text-white ' />
      </button>
      <Modal
        isOpen={openEditModel.isShown}
        onRequestClose={() => setOpenEditModel({ isShown: false })}
        style={{ overlay: { backgroundColor: 'rgba(0,0,0,0.2)' } }}
        contentLabel="Add/Edit Note"
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5"
      >
        <AddEditNotes
          type={openEditModel.type}
          notesData={openEditModel.data}
          onClose={() => setOpenEditModel({ isShown: false })}
          onAdd={addNote}
          onEdit={editNote}
        />
      </Modal>
    </>
  );
};

export default Home;

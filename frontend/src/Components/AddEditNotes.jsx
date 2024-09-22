import React, { useState, useEffect } from 'react';
import TagsInput from './Tags/TagsInput';
import { MdClose } from 'react-icons/md';

const AddEditNotes = ({ notesData, type, onClose, onAdd, onEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (type === 'edit' && notesData) {
      setTitle(notesData.title);
      setContent(notesData.content);
      setTags(notesData.tags || []);
    }
  }, [notesData, type]);

  const handleNotes = () => {
    if (!title) {
      setError('Please enter the title');
      return;
    }
    if (!content) {
      setError('Please enter the content');
      return;
    }
    setError("");

    const noteData = {
      title,
      content,
      tags,
    };

    if (type === 'add') {
      onAdd(noteData);
    } else if (type === 'edit') {
      onEdit({ ...noteData, _id: notesData._id });
    }
  };

  return (
    <div className="relative">
      <button
        className='w-10 h-10 flex items-center justify-center absolute -right-3 -top-3'
        onClick={onClose}
      >
        <MdClose className='text-xl text-slate-600 hover:bg-slate-100 rounded-sm' />
      </button>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>Title</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go To Gym At 5'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <div className="flex flex-col gap-2 mt-4">
          <label className="input-label">CONTENT</label>
          <textarea
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder='Content'
            value={content}
            onChange={({ target }) => setContent(target.value)}
            rows={10}
          />
        </div>
        <div className="mt-5">
          <label className="input-label">TAGS</label>
          <TagsInput tags={tags} setTags={setTags} />
        </div>
        {error && <p className="text-red-600 text-xs pt-4">{error}</p>}
        <button className="font-medium mt-5 p-3 text-white bg-blue-700 rounded hover:bg-blue-800" onClick={handleNotes}>
          {type === 'add' ? 'ADD' : 'UPDATE'}
        </button>
      </div>
    </div>
  );
};

export default AddEditNotes;

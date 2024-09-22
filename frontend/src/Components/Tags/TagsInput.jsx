import React, { useState } from 'react';
import { MdAdd, MdClose } from 'react-icons/md';

const TagsInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div>
            {tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {tags.map((tag, index) => (
                        <span key={index} className='flex items-center  bg-slate-200 text-black  gap-2 text-sm px-2 py-1 rounded'>
                            #{tag}
                            <button 
                                className='ml-2'
                                onClick={() => handleRemoveTag(tag)}>
                                <MdClose />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <div className="flex gap-4 items-center mt-3">
                <input 
                    type="text" 
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    value={inputValue}
                    className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
                    placeholder='Add Tags' 
                />
                <button 
                    className="w-8 h-8 flex items-center justify-center rounded border-blue-700 border hover:bg-blue-600"
                    onClick={addNewTag}
                >
                    <MdAdd className="text-2xl text-blue-600 hover:text-white"/>
                </button>
            </div>
        </div>
    );
};

export default TagsInput;

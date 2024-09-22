import React from 'react'
import { MdOutlinePushPin } from "react-icons/md";
import { IoIosCreate } from "react-icons/io";
import { RiDeleteBin2Fill } from "react-icons/ri";
const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinnedNote,
}) => {
  return (
    <div className='border rounded p-4 bg-transparent hover:shadow-xl transition-all ease-in-out'>
        <div className='flex items-center justify-between'>
            <div className="">
            <h6 className='text-sm font-medium'>{title}</h6>
            <span className="text-sx text-slate-500">{date}</span>
            </div>
            <MdOutlinePushPin className={`icon-btn ${isPinned?'text-blue-700':'text-slate-300'}`}/>
        </div>
        <p className='text-xs text-slate-600 mt-2'>{content?.slice(0,60)}</p>
        <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
                {tags}
            </div>
            <div className="flex items-center gap-2">
                <IoIosCreate className="icon-btn hover:text-green-500" />
                <RiDeleteBin2Fill className="icon-btn hover:text-red-500" />
            </div>
        </div>
        
        
    </div>
  )
}

export default NoteCard
import React from 'react'


const InputButton = ({type,text}:{type:"submit"|"reset"|"button",text:string}) => {
  return (
    <div>
        <button 
          type={type} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg mt-6 transition duration-200"
        >
          {text}
        </button>
    </div>
  )
}

export default InputButton
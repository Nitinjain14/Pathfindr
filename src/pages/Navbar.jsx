import React from 'react'

const Navbar = () => {
  return (
    <div className=' bg-gray-900 flex justify-between pt-10 pb-14 text-center text-gray-200 font-mono'>
      <h1 className=' ml-16 text-5xl'>
        Pathfinder
      </h1>
      
      <button className=' mr-16 py-2 px-6 text-xl rounded-md bg-teal-600 text-gray-200' onClick = {() => window.location.reload()}>
        Reset
      </button>
    </div>
  )
}

export default Navbar
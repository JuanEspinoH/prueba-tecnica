import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className=" w-full h-[100vh] px-5 flex items-center justify-center flex-col gap-3 bg-gradient-to-r from-fuchsia-600 to-pink-600">
      <h1 className=" text-4xl sm:text-7xl text-center text-wrap text-white font-bold">
        Pagina no encontrada
      </h1>
      <Link to={'/'}>
        <button className="cursor-pointer hover:border-white w-60 sm:w-auto hover:bg-gradient-to-r from-pink-700 to-fuchsia-700 p-5 rounded-md border-2 border-transparent">
          <p className="text-white text-2xl sm:text-4xl"> Regresar a Home</p>
        </button>
      </Link>
    </div>
  )
}

export default NotFound

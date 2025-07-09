import React, { useState, useEffect } from 'react'
import useGlobalStore from '../context/useGlobalStore'

const NotFound = () => {
  const { store, actions } = useGlobalStore()

  return (
    <div className=" w-full h-[100vh] flex items-center justify-center flex-col gap-3">
      <h1 className="text-7xl text-blue-600 font-bold">Pagina no encontrada</h1>
    </div>
  )
}

export default NotFound

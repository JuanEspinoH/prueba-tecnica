import React from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  const { store, actions } = useGlobalStore()

  const handleLogOut = () => {
    actions.logout()
    navigate('/inicio-sesion')
  }
  return (
    <nav className="w-full flex justify-between items-center bg-blue-900 py-3 px-4 ">
      <p className="text-white text-3xl">{`Tareas de ${store.currentUser.username}`}</p>
      <button
        className="bg-white text-blue-900 p-3"
        onClick={() => handleLogOut()}
      >
        Log out
      </button>
    </nav>
  )
}

export default Navbar

import React from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate } from 'react-router-dom'
import GearIcon from './GearIcon'

const Navbar = () => {
  const navigate = useNavigate()
  const { store, actions } = useGlobalStore()

  const handleLogOut = () => {
    actions.logout()
    navigate('/inicio-sesion')
  }
  return (
    <nav
      className="
    bg-gradient-to-r from-indigo-700 to-blue-700
    border-b-2 border-indigo-800
    mb-4
    w-full flex justify-between items-center  py-3 px-4 "
    >
      <div className="flex justify-center items-center gap-3 flex-row">
        <p className="text-white font-extrabold text-3xl">{`Tareas de ${store.currentUser.username}`}</p>
        {/* <GearIcon /> */}
      </div>
      <button
        className="bg-white text-blue-900 cursor-pointer rounded-md p-3"
        onClick={() => handleLogOut()}
      >
        Log out
      </button>
    </nav>
  )
}

export default Navbar

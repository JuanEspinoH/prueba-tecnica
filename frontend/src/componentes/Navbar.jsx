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
    <nav>
      <p>{store.currentUser.username}</p>
      <button onClick={() => handleLogOut()}>Log out</button>
    </nav>
  )
}

export default Navbar

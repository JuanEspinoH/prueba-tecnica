import React, { useEffect } from 'react'
import Navbar from '../componentes/Navbar'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate()
  const { store, actions } = useGlobalStore()
  // revisar si el usuario esta logueado
  useEffect(() => {
    const checkToken = !!localStorage.getItem('token')
    if (checkToken === false) {
      if (
        !store.currentUser.username ||
        !store.currentUser.password ||
        !store.currentUser.email
      ) {
        navigate('/inicio-sesion')
      }
    }
  }, [])

  if (store.globalLoading) {
    return <h3>Cargando</h3>
  }

  return (
    <main>
      <Navbar />
      Home
    </main>
  )
}

export default Home

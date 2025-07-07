import React, { useEffect, useState } from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate } from 'react-router-dom'

const Registro = () => {
  const navigate = useNavigate()
  const { _, actions } = useGlobalStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formInfo, setFormInfo] = useState({
    email: '',
    password: '',
  })
  // Combio de estado
  const handleChange = (e) => {
    setFormInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }

  const handleSubmit = (e) => {
    setError('')
    e.preventDefault()
    setLoading(true)
    actions
      .login(formInfo)
      .then((res) => {
        actions.modificarCurrentUser(res)
        navigate('/')
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return <h1>Cargando</h1>
  }

  return (
    <div>
      Iniciar Sesion
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            name="email"
            value={formInfo.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            type="text"
            name="password"
            value={formInfo.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      {error && <h3>{error}</h3>}
    </div>
  )
}

export default Registro

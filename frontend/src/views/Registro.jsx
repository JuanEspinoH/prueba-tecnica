import React, { useEffect, useState } from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate } from 'react-router-dom'

const Registro = () => {
  const navigate = useNavigate()
  const { _, actions } = useGlobalStore()
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [redirectHome, setRedirectHome] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formInfo, setFormInfo] = useState({
    username: '',
    email: '',
    password: '',
  })
  // Combio de estado
  const handleChange = (e) => {
    setFormInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value }
    })
  }
  // Esto se encarga de redireccionar si esta correcta la info, tuve que usar dos states por que al cargar la pagina se redireccionaba y necesitaba mas control
  useEffect(() => {
    if (redirectHome === true) {
      const timerRedirect = setTimeout(() => {
        navigate('/inicio-sesion')
      }, 3000)

      return () => clearTimeout(timerRedirect)
    }
  }, [redirect])

  const handleSubmit = (e) => {
    setError('')
    e.preventDefault()
    setLoading(true)
    actions
      .registroUsuario(formInfo)
      .then((res) => {
        setSuccess(`${res.msg} , redireccionando a Iniciar sesion`)
        setRedirectHome(true)
        setRedirect((prev) => !prev)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // Reiniciar los states

  useEffect(() => {
    return () => {
      setLoading(false)
      setRedirect(false)
      setRedirectHome(false)
      setError('')
      setSuccess('')
      setFormInfo({})
    }
  }, [])

  if (loading) {
    return <h1>Cargando</h1>
  }

  return (
    <div>
      Registro
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            id="username"
            type="text"
            name="username"
            value={formInfo.username}
            onChange={handleChange}
          />
        </div>
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
      {success && <h3>{success}</h3>}
    </div>
  )
}

export default Registro

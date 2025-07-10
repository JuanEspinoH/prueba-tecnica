import React, { useState } from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate, Link } from 'react-router-dom'
import Spinner from '../componentes/Spinner'
const Registro = () => {
  const navigate = useNavigate()
  const { _, actions } = useGlobalStore()
  const [loading, setLoading] = useState(false)
  const [__, setError] = useState('')
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
    return (
      <div className=" w-full h-[100vh] flex items-center justify-center flex-col gap-3">
        <Spinner />
        <p className="text-3xl font-bold text-blue-700">Iniciando sesion</p>
      </div>
    )
  }

  return (
    <div className=" w-full h-[100vh] flex items-center justify-center flex-col gap-3">
      <h1 className="text-6xl text-blue-600">Tareas React-Flask</h1>
      <h3 className="text-4xl">Iniciar Sesion</h3>

      <form
        onSubmit={handleSubmit}
        className="border-1 border-gray-400 w-3/6 shadow-[0px_8px_0px_0px_rgba(0,_0,_0,_0.2)] h-auto 
        flex items-center justify-center flex-col gap-3
        px-5 py-7 rounded-3xl"
      >
        <div className="w-full">
          <label className="text-3xl   " htmlFor="email">
            Email:
          </label>
          <input
            className="w-full my-3 text-2xl border-2 rounded-md border-blue-400"
            id="email"
            type="text"
            name="email"
            value={formInfo.email}
            onChange={handleChange}
          />
        </div>
        <div className="w-full my-3 text-2xl">
          <label className="text-3xl  " htmlFor="password">
            Contraseña:
          </label>
          <input
            className="w-full border-2 rounded-md border-blue-400"
            id="password"
            type="text"
            name="password"
            value={formInfo.password}
            onChange={handleChange}
          />
        </div>
        <button
          className="text-2xl text-center w-full bg-blue-500 p-1.5 text-white"
          type="submit"
        >
          Submit
        </button>

        <div className="w-full flex items-center justify-between">
          <Link
            to={'/registro'}
            className="text-sm underline text-blue-700 font-bold"
          >
            ¿No tienes cuenta ? Crea una aqui.
          </Link>
          <Link
            to={'/recuperar-password'}
            className="underline text-sm text-blue-700 font-bold"
          >
            ¿Olvidaste tu contraseña ? Recuperala{' '}
            <span className="font-bold"> aqui.</span>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Registro

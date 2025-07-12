import React, { useState } from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate, Link } from 'react-router-dom'
import Spinner from '../componentes/Spinner'
import { toast } from 'react-hot-toast'

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
        toast.error(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  if (loading) {
    return (
      <div
        className="
       bg-gradient-to-r from-indigo-400 to-cyan-400
      w-full h-[100vh] flex items-center justify-center flex-col gap-3"
      >
        <Spinner />
        <p className="text-3xl font-bold text-white">Cargando</p>
      </div>
    )
  }

  return (
    <div
      className=" 
    bg-gradient-to-r from-indigo-400 to-cyan-400
    w-full h-[100vh] flex items-center justify-center flex-col gap-3"
    >
      <h1 className="text-4xl  sm:text-5xl  md:text-6xl  font-extrabold text-white">
        Tareas React-Flask
      </h1>
      <h3 className="text-3xl sm:text-4xl md:text-5xl  ">Iniciar Sesion</h3>

      <form
        onSubmit={handleSubmit}
        className="
        isolate rounded-xl bg-white/60 shadow-lg ring-1 ring-black/5
        border-1 border-gray-400 w-5/6 sm:w-4/6    h-auto 
        flex items-center justify-center flex-col gap-3
        px-5 py-7 "
      >
        <div className="w-full">
          <label className="text-2xl sm:text-3xl md:text-4xl" htmlFor="email">
            Email:
          </label>
          <input
            className="w-full text-center my-3 text-2xl border-2 rounded-md border-blue-400"
            id="email"
            type="text"
            name="email"
            value={formInfo.email}
            onChange={handleChange}
          />
        </div>
        <div className="w-full my-3 ">
          <label
            className="text-2xl sm:text-3xl md:text-4xl "
            htmlFor="password"
          >
            Contraseña:
          </label>
          <input
            className="w-full text-center border-2 text-2xl rounded-md border-blue-400"
            id="password"
            type="text"
            name="password"
            value={formInfo.password}
            onChange={handleChange}
          />
        </div>
        <button
          className="text-2xl cursor-pointer hover:bg-blue-400 text-center w-full bg-blue-500 p-1.5 text-white"
          type="submit"
        >
          Enviar
        </button>

        <div className="w-full flex items-center sm:flex-row flex-col gap-2 justify-between">
          <Link
            to={'/registro'}
            className="sm:text-sm text-xs w-full sm:w-1/2  text-center underline text-blue-700 font-bold"
          >
            ¿No tienes cuenta ? Crea una aqui.
          </Link>
          <Link
            to={'/recuperar-password'}
            className="underline sm:text-sm text-xs w-full sm:w-1/2 text-center text-blue-700 font-bold"
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

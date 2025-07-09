import React, { useEffect, useState } from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate, Link } from 'react-router-dom'
import Spinner from '../componentes/Spinner'
import { toast } from 'react-hot-toast'

const Registro = () => {
  const navigate = useNavigate()
  const { _, actions } = useGlobalStore()
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(false)
  const [redirectHome, setRedirectHome] = useState(false)

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
        console.log(res)
        toast.success(`${res.msg} , redireccionando a Iniciar sesion`)
        setRedirectHome(true)
        setRedirect((prev) => !prev)
      })
      .catch((err) => {
        console.log(err)
        toast.error(`${err.message} `)
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

      setFormInfo({})
    }
  }, [])

  if (loading) {
    return (
      <div className=" w-full h-[100vh] flex items-center justify-center flex-col gap-3">
        <Spinner />
        <p className="text-3xl font-bold text-blue-700">Creando usuario</p>
      </div>
    )
  }

  return (
    <div className=" w-full h-[100vh] flex items-center justify-center flex-col gap-3">
      <h1 className="text-6xl text-blue-600">Tareas React-Flask</h1>
      <h3 className="text-4xl">Registra tu cuenta</h3>

      <form
        onSubmit={handleSubmit}
        className="border-1 border-gray-400 w-3/6 shadow-[0px_8px_0px_0px_rgba(0,_0,_0,_0.2)] h-auto 
        flex items-center justify-center flex-col gap-3
        px-5 py-7 rounded-3xl"
      >
        <div className="w-full">
          <label className="text-3xl   " htmlFor="username">
            Nombre de usuario
          </label>
          <input
            className="w-full my-3 text-2xl border-2 rounded-md border-blue-400"
            id="username"
            type="text"
            name="username"
            value={formInfo.username}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="text-3xl   " htmlFor="email">
            Email
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
        <div className="w-full">
          <label className="text-3xl   " htmlFor="password">
            Contraseña
          </label>
          <input
            className="w-full my-3 text-2xl border-2 rounded-md border-blue-400"
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
        <div>
          <Link
            to={'/inicio-sesion'}
            className="underline text-blue-700 font-bold"
          >
            ¿Ya tienes cuenta ? Inicia sesion.
          </Link>
        </div>
      </form>
    </div>
  )
}

export default Registro

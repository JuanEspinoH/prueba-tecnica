import React, { _, useState } from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { Link } from 'react-router-dom'
import Spinner from '../componentes/Spinner'
import { toast } from 'react-hot-toast'

const RecuperarContraseña = () => {
  const { _, actions } = useGlobalStore()
  const [emailData, setEmailData] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    actions
      .recuperarContra({ email: emailData })
      .then((res) => {
        setEmailData('')
        console.log(res)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col w-full h-[100vh] gap-3">
        <Spinner />
        <h3 className="text-2xl text-blue-500">Esperando respuesta</h3>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center flex-col w-full h-[100vh] gap-3">
      <h1 className="text-6xl text-blue-600">Tareas React-Flask</h1>
      <h3 className="text-4xl">Recuperar contraseña</h3>
      <form
        onSubmit={handleSubmit}
        className="border-1 border-gray-400 w-3/6 shadow-[0px_8px_0px_0px_rgba(0,_0,_0,_0.2)] h-auto 
            flex items-center justify-center flex-col gap-3
            px-5 py-7 rounded-3xl"
      >
        <div className="w-full">
          <label className="text-3xl   " htmlFor="email">
            Email
          </label>
          <input
            className="w-full my-3 text-2xl border-2 rounded-md border-blue-400"
            id="email"
            type="text"
            name="email"
            value={emailData}
            onChange={(e) => setEmailData(e.target.value)}
          />
        </div>

        <button
          className="text-2xl text-center w-full bg-blue-500 p-1.5 text-white"
          type="submit"
        >
          Submit
        </button>
        <div className="w-full flex sm:flex-row gap-2 flex-col items-center justify-between">
          <Link
            to={'/inicio-sesion'}
            className="text-sm w-full sm:w-1/2 underline text-center  text-blue-700 font-bold"
          >
            ¿Ya tienes cuenta ? Inicia sesion.
          </Link>
          <Link
            to={'/recuperar-password'}
            className="underline text-sm sm:w-1/2 w-full text-center text-blue-700  font-bold"
          >
            ¿Olvidaste tu contraseña ? Recuperala{' '}
            <span className="font-bold"> aqui.</span>
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RecuperarContraseña

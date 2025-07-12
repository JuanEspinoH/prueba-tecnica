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
    w-full h-auto min-h-[100vh] pb-6 flex items-center justify-center flex-col gap-3"
    >
      <h1 className="text-4xl  sm:text-5xl  md:text-6xl font-extrabold text-white">
        Tareas React-Flask
      </h1>
      <h3 className="text-3xl sm:text-4xl md:text-5xl ">
        Recuperar contraseña
      </h3>
      <form
        onSubmit={handleSubmit}
        className=" isolate    rounded-xl bg-white/60 shadow-lg ring-1 ring-black/5
        border-1 border-gray-400 w-5/6 sm:w-4/6  h-auto 
        flex items-center justify-center flex-col gap-3
        px-5 py-7"
      >
        <div className="w-full">
          <label
            className="text-2xl sm:text-3xl md:text-4xl    "
            htmlFor="email"
          >
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
          Recuperar contraseña
        </button>
        <div className="w-full flex sm:flex-row gap-2 flex-col items-center justify-between">
          <Link
            to={'/inicio-sesion'}
            className="sm:text-sm text-xs w-full sm:w-1/2 underline text-center  text-blue-700 font-bold"
          >
            ¿Ya tienes cuenta ? Inicia sesion.
          </Link>
          <Link
            to={'/registro'}
            className="sm:text-sm text-xs w-full sm:w-1/2 text-center underline text-blue-700 font-bold"
          >
            ¿No tienes cuenta ? Crea una aqui.
          </Link>
        </div>
      </form>
    </div>
  )
}

export default RecuperarContraseña

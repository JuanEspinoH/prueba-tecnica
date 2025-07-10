import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useGlobalStore from '../context/useGlobalStore'
import { toast } from 'react-hot-toast'
import Spinner from '../componentes/Spinner'
const ReescribirContraseña = () => {
  const navigate = useNavigate()
  const { tokenId } = useParams()
  const [loading, setLoading] = useState(true)
  const [passwordData, setPasswordData] = useState('')
  const { _, actions } = useGlobalStore()

  useEffect(() => {
    actions
      .reescribirContraCheck({ token: tokenId })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        console.log(err.message)
        toast.error(err.message)
        navigate('/registro')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    actions
      .reescribirContraForm({ password: passwordData, token: tokenId })
      .then((res) => {
        console.log(res)
        toast.success(res.msg)
        navigate('/login')
      })
      .catch((err) => {
        console.log(err.message)
        toast.error(err.message)
      })
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center flex-col w-full h-[100vh] gap-3">
        <Spinner />
        <h3 className="text-2xl text-blue-500">
          Piensa en tu nueva contraseña
        </h3>
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
          <label className="text-3xl   " htmlFor="password">
            Password
          </label>
          <input
            className="w-full my-3 text-2xl border-2 rounded-md border-blue-400"
            id="password"
            type="text"
            value={passwordData}
            onChange={(e) => setPasswordData(e.target.value)}
          />
        </div>

        <button
          className="text-2xl text-center w-full bg-blue-500 p-1.5 text-white"
          type="submit"
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default ReescribirContraseña

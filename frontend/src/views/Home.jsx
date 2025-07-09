import React, { useEffect, useState } from 'react'
import Navbar from '../componentes/Navbar'
import useGlobalStore from '../context/useGlobalStore'
import { useNavigate } from 'react-router-dom'
import TaskContainer from '../componentes/TaskContainer'
import Spinner from '../componentes/Spinner'
import { toast } from 'react-hot-toast'

const Home = () => {
  const navigate = useNavigate()
  const { store, actions } = useGlobalStore()
  const [loading, setLoading] = useState(true)
  const [usuarioRegistrado, setUsuarioRegistrado] = useState(false)
  const [tarea, setTarea] = useState('')
  const [tasks, setTasks] = useState([])

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
        toast.error('Usuario no ha iniciado sesion')
        return
      }
    } else {
      setUsuarioRegistrado(true)
    }
  }, [])

  useEffect(() => {
    if (usuarioRegistrado) {
      actions
        .getTasks()
        .then((res) => {
          setTasks(res.data)
        })
        .catch((err) => {
          toast.error(err.message)
        })
        .finally(() => setLoading(false))
    }
  }, [usuarioRegistrado])

  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    actions
      .addTask({ label: tarea })
      .then(async (res) => {
        const tasks = await actions.getTasks()
        setTasks(tasks.data)
        setTarea('')
        toast.success(res.msg)
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  if (loading) {
    return (
      <main className=" w-full  h-[100vh] flex items-center justify-center flex-col gap-2">
        <Spinner />
        <p className="text-3xl font-bold text-blue-700">Cargando tareas</p>
      </main>
    )
  }

  return (
    <main className="">
      <Navbar />
      <div className=" px-4 mb-2 pb-2 gap-3 flex items-center justify-center flex-col">
        <h2 className="text-4xl">Crear nota</h2>
        <form
          onSubmit={onSubmit}
          className=" w-[95%] p-3 rounded-2xl shadow-[0px_8px_0px_0px_rgba(0,_0,_0,_0.2)]   border-2 border-gray-400  "
        >
          <div className="">
            <label className="font-bold" htmlFor="label">
              Escribe tu tarea:
            </label>
            <input
              className="w-full h-7 my-2 bg-gray-300 p-2 font-bold"
              id="label"
              type="text"
              onChange={(e) => setTarea(e.target.value)}
              value={tarea}
            />
          </div>
          <button className="w-full bg-blue-900 text-white" type="submit">
            Enviar
          </button>
        </form>
      </div>

      <div className="px-4 mb-2 pb-2 gap-3 flex items-center justify-center flex-col">
        <div className="w-[95%]  mb-2 pb-2   flex items-center justify-center flex-col gap-4  ">
          {tasks?.length !== 0 ? (
            tasks?.map((t) => (
              <TaskContainer key={t.id} {...t} setTasks={setTasks} />
            ))
          ) : (
            <p>No hay mensajes</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default Home

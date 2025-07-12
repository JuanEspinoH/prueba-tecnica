import React, { useEffect, useState } from 'react'
import useGlobalStore from '../context/useGlobalStore'
import { toast } from 'react-hot-toast'
import CheckIcon from './CheckIcon'
import EditIcon from './EditIcon'
import CrossIcon from './CrossIcon'
import DeleteIcon from './DeleteIcon'
import Spinner from './Spinner'

const TaskContainer = ({ id, label, completed, setTasks }) => {
  const { _, actions } = useGlobalStore()
  const [loading, setLoading] = useState(false)
  const [edit, setEdit] = useState(false)
  const [labelData, setLabelData] = useState(label)
  const [completedData, setCompletedData] = useState(completed)
  const [completedDataFlag, setCompletedDataFlag] = useState(false)

  useEffect(() => {
    setCompletedDataFlag(true)
  }, [])

  useEffect(() => {
    if (!completedDataFlag) return
    handleEdit({ label: labelData, id, completed: completedData })
  }, [completedData])

  const handleChangeText = (e) => {
    setLabelData(e.target.value)
  }
  const handleChangeCompleted = () => {
    setCompletedData((prev) => !prev)
  }
  const handleLabelEdit = () => {
    if (labelData.trim().length === 0) {
      toast.error('El campo no debe de estar vacio')
      return
    }
    handleEdit({ label: labelData, id, completed: completedData })
  }

  const handleDelete = () => {
    setLoading(true)
    actions
      .deleteTask({ id })
      .then(async (res) => {
        const newTask = await actions.getTasks()
        setTasks(newTask.data)
      })
      .catch((err) => {
        toast.error(err.message)
        console.log(err)
      })
      .finally(() => setLoading(false))
  }

  const handleEdit = async (info) => {
    setLoading(true)
    actions
      .editTask(info)
      .then(async (res) => {
        setCompletedData(res.data.completed)
        setLabelData(res.data.label)
        setEdit(false)
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => setLoading(false))
  }
  if (loading) {
    return (
      <div className="p-5  gap-2 flex items-center justify-center flex-col w-full shadow-[0px_8px_0px_0px_rgba(0,_0,_0,_0.2)] border-2 border-gray-400 rounded-2xl h-32">
        <Spinner />
      </div>
    )
  }

  return (
    <div
      className="
    isolate   rounded-xl bg-white/20 shadow-lg ring-1 ring-black/5
    p-5  gap-2 flex items-center justify-center flex-col w-full  border-2 border-gray-400  h-32"
    >
      <div className="w-full  h-20 flex justify-between items-center flex-row ">
        <input
          disabled={edit ? false : true}
          className={` h-full text-2xl ${
            edit ? 'bg-amber-200 w-[80%] border-1 border-amber-900' : 'w-full'
          }`}
          value={labelData}
          onChange={handleChangeText}
        />
        {edit && (
          <button
            onClick={() => handleLabelEdit()}
            className="bg-yellow-600 h-full w-[20%] cursor-pointer  border-1 border-amber-950"
          >
            Enviar
          </button>
        )}
      </div>

      <div className="w-full flex group justify-between items-center">
        <button
          onClick={() => {
            handleChangeCompleted()
          }}
          className={
            completedData
              ? 'w-3/12 rounded-sm p-1  bg-green-500 flex  justify-center items-center cursor-pointer'
              : 'w-3/12 rounded-sm p-1  bg-gray-500 flex   justify-center items-center cursor-pointer '
          }
        >
          {completedData ? <CheckIcon /> : <CrossIcon />}
        </button>
        <button
          onClick={() => setEdit((prev) => !prev)}
          className={`w-3/12 ${
            edit ? 'bg-amber-800' : 'bg-amber-500'
          }  flex rounded-sm p-1  justify-center items-center cursor-pointer`}
        >
          {edit ? <EditIcon bg="bg-amber-800" /> : <EditIcon />}
        </button>
        <button
          onClick={() => handleDelete()}
          className="w-3/12 bg-red-500 flex  justify-center rounded-sm p-1 items-center cursor-pointer"
        >
          <DeleteIcon />
        </button>
      </div>
    </div>
  )
}

export default TaskContainer

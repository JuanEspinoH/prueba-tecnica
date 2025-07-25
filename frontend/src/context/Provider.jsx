import { useState, useEffect } from 'react'
import { GlobalContext } from './Context'

export const GlobalStoreaProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})
  const [globalLoading, setGlobalLoading] = useState(false)
  const modificarCurrentUser = (data) => {
    return setCurrentUser(data)
  }
  useEffect(() => {
    const checkToken = !!localStorage.getItem('token')
    if (checkToken) {
      if (
        !currentUser.username ||
        !currentUser.password ||
        !currentUser.email
      ) {
        setGlobalLoading(true)
        self()
          .then((res) => {
            setCurrentUser(res)
          })
          .catch((err) => console.log(err))
          .finally(() => setGlobalLoading(false))
      }
    }
  }, [])
  const registroUsuario = async (body) => {
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }

      const data = await response.json()

      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const login = async (body) => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)

      return data.data
    } catch (error) {
      throw new Error(error.msg)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setCurrentUser({})
  }

  const self = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3000/self', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }

      const data = await response.json()

      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const getTasks = async () => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }

      const data = await response.json()

      const result = { data: data.data.sort((a, b) => b.id - a.id) }
      // console.log(result)
      return result
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const addTask = async (body) => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const editTask = async (body) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const deleteTask = async (body) => {
    const token = localStorage.getItem('token')
    try {
      const response = await fetch('http://localhost:3000/tasks', {
        method: 'DELETE',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const recuperarContra = async (body) => {
    try {
      const response = await fetch(
        'http://localhost:3000/recuperar-contraseña',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const reescribirContraCheck = async (body) => {
    try {
      const response = await fetch(
        'http://localhost:3000/reescribir-contraseña',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }
  const reescribirContraForm = async (body) => {
    try {
      const response = await fetch(
        'http://localhost:3000/reescribir-contraseña-form',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      )
      if (!response.ok) {
        const error = await response.json()
        throw error
      }
      const data = await response.json()
      return data
    } catch (error) {
      throw new Error(error.msg)
    }
  }

  const store = {
    store: { currentUser, globalLoading },
    actions: {
      registroUsuario,
      modificarCurrentUser,
      login,
      logout,
      self,
      getTasks,
      addTask,
      editTask,
      deleteTask,
      recuperarContra,
      reescribirContraCheck,
      reescribirContraForm,
    },
  }

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  )
}

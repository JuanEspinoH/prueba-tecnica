import { useState, useEffect } from 'react'
import { GlobalContext } from './Context'

export const GlobalStoreaProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})
  const modificarCurrentUser = (data) => {
    return setCurrentUser(data)
  }
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
      // console.error(error.msg)
    }
  }
  const store = {
    store: { currentUser },
    actions: { registroUsuario, modificarCurrentUser },
  }

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  )
}

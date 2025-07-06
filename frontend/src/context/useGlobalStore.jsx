import { GlobalContext } from './Context'
import { useContext } from 'react'

const useGlobalStore = () => useContext(GlobalContext)

export default useGlobalStore

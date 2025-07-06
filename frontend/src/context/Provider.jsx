import { GlobalContext } from './Context'

export const GlobalStoreaProvider = ({ children }) => {
  const store = {
    test: 'test',
  }

  return (
    <GlobalContext.Provider value={store}>{children}</GlobalContext.Provider>
  )
}

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalStoreaProvider } from './context/Provider'

import Home from './views/Home'
import InicioSesion from './views/InicioSesion'
import Registro from './views/Registro'

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStoreaProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/inicio-sesion" element={<InicioSesion />} />
          </Routes>
        </div>
      </GlobalStoreaProvider>
    </BrowserRouter>
  )
}

export default App

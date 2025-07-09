import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalStoreaProvider } from './context/Provider'
import { Toaster } from 'react-hot-toast'

import Home from './views/Home'
import InicioSesion from './views/InicioSesion'
import Registro from './views/Registro'
import NotFound from './views/NotFound'

const App = () => {
  return (
    <BrowserRouter>
      <GlobalStoreaProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/inicio-sesion" element={<InicioSesion />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </GlobalStoreaProvider>
    </BrowserRouter>
  )
}

export default App

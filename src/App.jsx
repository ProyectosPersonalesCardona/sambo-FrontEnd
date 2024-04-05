import { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Views
import { AreaAdmin } from './components/AreaAdmin';
import { Login } from './components/login';
import { Atletas } from './components/Atletas';
import { Usuarios } from './components/Usuarios';
import { Maestros } from './components/Maestros';
import { Escuelas } from './components/Escuelas';
import { Torneos } from './components/Torneos';
import { SubirPost } from './components/SubirPost';
import { MainPage } from './components/MainPage';
import NotFound from './components/NotFound';

export const App = () => {

  const [user, setUser] = useState({
    username: '',
    rolid: 0,
  });

  useEffect(() => {
    checkAuth();
    async function checkAuth() {
      try {
        const { data } = await axios(`${import.meta.env.VITE_URL}/api/auth`, { withCredentials: true });
        setUser({
          username: data.username,
          rolid: data.rolid,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/*Correcion login se agrego:  iniciarSesion={setUser}  */}
          <Route path='/login' element={<Login iniciarSesion={setUser} />} />
          <Route path='/' element={<MainPage />} />
          <Route path='/admin/*' element={<AreaAdmin user={user} />}>
            {/* Todos los componente <Route/> que pongan dentro de este <Route/> son rutas hijas (explicaciacion de que pasara con las rutas hijas en AreaAdmin) */}
            {user.rolid == 2 || user.rolid == 3 ? (
              <>
                <Route path='usuarios' element={<Usuarios />} />
                <Route path='atletas' element={<Atletas />} />
                <Route path='maestros' element={<Maestros />} />
                <Route path='escuelas' element={<Escuelas />} />
                <Route path='torneos' element={<Torneos />} />
              </>
            ) : null}
            {user.rolid == 1 ? (
              <Route path='editor' element={<SubirPost />} />
            ) : null}
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

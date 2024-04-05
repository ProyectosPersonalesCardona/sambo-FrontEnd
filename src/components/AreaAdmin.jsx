/* eslint-disable react/prop-types */
import './css/areaAdmin.css';
import samboLogo from '../assets/samboLogo.jpeg';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
const urlApi = import.meta.env.VITE_URL;

export const AreaAdmin = ({ user }) => {
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const navigate = useNavigate();

  const closeOffcanvas = () => {
    setIsOffcanvasOpen(false);
  };

  const handleOffcanvasLinkClick = (to) => {
    closeOffcanvas();
    // Agrega un pequeño retraso para asegurarte de que la animación de cierre tenga tiempo para completarse
    setTimeout(() => {
      navigate(to);
    }, 300);
  };

  
  const cerrarSesion = async ()=>{
    const url = `${urlApi}/api/auth/cerrarSesion`
    await (axios.get(url, {withCredentials:true} ))
    navigate('/login')
}

  const links = [
    {
      title: 'Usuarios',
      to: '/admin/usuarios',
      show: user.rolid == 2 || user.rolid == 3
    },
    {
      title: 'Atletas',
      to: '/admin/atletas',
      show: user.rolid == 2 || user.rolid == 3
    },
    {
      title: 'Maestros',
      to: '/admin/maestros',
      show: user.rolid == 2 || user.rolid == 3
    },
    {
      title: 'Escuelas',
      to: '/admin/escuelas',
      show: user.rolid == 2 || user.rolid == 3
    },
    {
      title: 'Torneos',
      to: '/admin/torneos',
      show: user.rolid == 2 || user.rolid == 3
    },
    {
      title: 'Area de editor',
      to: '/admin/editor',
      show: user.rolid == 1
    },
  ];

  return (
    <section id="area-total" className="d-flex">
      {/* Barra lateral en dispositivos de escritorio */}
      <div id='barra-lateral'>
        <div id='info-user' className='d-flex align-items-center justify-content-center flex-column'>
          <img src={samboLogo} alt="" />
          <p>{user.username}</p>
        </div>
        <div id='opciones'>
          {links.map(link => link.show ? (
            <Link
              key={link.to}
              to={link.to}
              className='mb-4 button-opcion'
            >
              {link.title}
            </Link>
          ) : null)}
          <button type='btn'className='mb-4 btn btn-danger' onClick={cerrarSesion}>Cerrar Sesion</button>
        </div>
      </div>

      {/* Botón de activación del offcanvas en dispositivos móviles */}
      <div className=' mb-5' id='div-btn-open'>
        <button className="btn " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasMobile" aria-controls="offcanvasMobile">
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-menu-2" width="45" height="45" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M4 6l16 0" />
          <path d="M4 12l16 0" />
          <path d="M4 18l16 0" />
        </svg>
        </button>
      </div>

      {/* Offcanvas en dispositivos móviles */}
      <div className={`offcanvas offcanvas-start ${isOffcanvasOpen ? 'show' : ''}`} tabIndex="-1" id="offcanvasMobile" aria-labelledby="offcanvasMobileLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title text-white fw-bold" id="offcanvasMobileLabel">Menú</h5>
          <button type="button" className="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div id='info-user' className='d-flex align-items-center justify-content-center flex-column'>
            <img src={samboLogo} alt="" />
            <p>{user.username}</p>
          </div>
          <div id='opciones' className=' mt-2 mb-3'>
            {links.map(link => link.show ? (
              <Link
                key={link.to}
                to={link.to}
                className='mb-4 button-opcion'
                data-bs-dismiss="offcanvas" // Cierra el offcanvas al hacer clic en un enlace
                onClick={() => handleOffcanvasLinkClick(link.to)}
              >
                {link.title}
              </Link>
            ) : null)}
            <button type='btn' className='mt-4 btn btn-danger w-50 p-3 mb-5 fw-bold' onClick={cerrarSesion}>Cerrar Sesion</button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div id='area-contenido' className="w-100">
        <Outlet />
      </div>
    </section>
  );
};

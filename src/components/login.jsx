import './css/login.css'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';

import axios from 'axios';

import logoSambo from '../assets/LOGOlogin.png.jpg';



const urlApi = import.meta.env.VITE_URL + '/api/auth';


export const Login = ({ iniciarSesion }) => {
  const [alerta, setAlerta] = useState(false);
  const navigate = useNavigate();
  var alertaMensaje = "Usuario o Contraseña no son validas Ingresa Nuevamente";

  const [formData, setFormData] = useState({
    NombreUsuario: "",
    password: ""
  });

  function useWindowWidth() {
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
      const handleResize = () => {
        setWidth(window.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return width;
  }
  let width = useWindowWidth();
  let color
  if(width<=590){
    color="#ffffff"
  }else{
    color="#000000"
  }
  const onHandleChange = (event) => {
    setAlerta(false);
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value });
  };

  const onHandleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post(urlApi, formData, { withCredentials: true });
      {/*Correcion login */ }
      iniciarSesion({
        username: data.user.username,
        rolid: data.user.rolid
      });

      console.log("Se inicio sesion");
      console.log(data);

      {/*Correcion login */ }

      if (data.user.rolid == 1) {
        // Es editor

        navigate('/admin/editor');
        setAlerta(false);
      } else {
        // admin o godsystem
        navigate('/admin/usuarios');

      }
    } catch (error) {
      setAlerta(true);
      console.log(error);
    }
  }
  const RegresarInicio = () => {
    navigate('/');
  }
  return (
    <>
      <main>
        <button type="button" className="btn mt-1 position-fixed" onClick={RegresarInicio} >
        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-left" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke={color} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M5 12l14 0" />
          <path d="M5 12l4 4" />
          <path d="M5 12l4 -4" />
        </svg>
        </button>

        <div className='contenedorTodo'>
          <div className='contenedorLogin'>
            <div className='contenedorImg '>
              <img src={logoSambo} alt='Logo_Sambo' className='rounded-5' />
            </div>
            <form onSubmit={onHandleSubmit}>
              <h2 className="mt-0 mb-4 text-white text-center" >Iniciar Sesión</h2>
              <div className="mb-3">
                <label className="form-label text-white">Usuario</label>
                <input type="texto" className="form-control" name="NombreUsuario" placeholder='Ingresa Tu Usuario' onChange={onHandleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label text-white">Contraseña</label>
                <input type="password" className="form-control" name="password" placeholder='Ingresa Tu Contraseña' onChange={onHandleChange} required />
              </div>
              <div className=" row mt-5 text-center">
                <button className="btn botonLogin ">Iniciar Sesion</button>
              </div>
            </form>
          </div>
        </div>
        <div className={alerta ? 'estilo-clickeado' : 'estilo-normal'} role="alert">{alertaMensaje} </div>

      </main>
    </>
  )
}
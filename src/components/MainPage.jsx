import './css/mainpage.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LOGO.png'
import bannerImg from '../assets/Banner.png'
import bannerImg2 from '../assets/banner2.png'
import bannerImg3 from '../assets/banner3.png'
import acercaDeImg from '../assets/imagen-2.jpg'
import banner1mobil from '../assets/banner1mobil.png'
import iconofacebook from '../assets/facebook.png'
import S from '../assets/S3.png'
import A from '../assets/A3.png'
import M from '../assets/M3.png'
import B from '../assets/B3.png'
import O from '../assets/O3.png'
import sambomobil from '../assets/sambo mobil.png'
import iconoinstagram from '../assets/instagram.png'
import banner2mobil from '../assets/banner2mobil.png'
import banner3mobil from '../assets/banner3mobil.png'
import PostsList from './PostsList';

export const MainPage = () => {
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
  let imgBanner = []
  if (width <= 590) {
    imgBanner = [banner1mobil, banner2mobil, banner3mobil]
  } else {
    imgBanner = [bannerImg, bannerImg2, bannerImg3]
  }
  const year = new Date().getFullYear();



  return (
    <>
      <div className='' style={{ backgroundColor: '#232428' }}>
        <nav className="navbar navbar-expand-md navbar-dark bg-dark" style={{ backgroundColor: '#232428' }} >
          <div className="container-fluid p-0 ">
            <div className="row w-100 m-0">
              <div className="col-md-4 d-flex align-items-center justify-content-start">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                  aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
              </div>
              <div className="col-md-4 d-flex align-items-center justify-content-center">
                <Link to="/">
                  <img src={logo} alt='logo' title='logo' className='logo' />
                </Link>
              </div>
              <div className="col-md-4 d-flex align-items-center justify-content-end mt-2">
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li className="nav-item w-100 text-center">
                      <Link className="nav-link fw-bold" to="/login">Iniciar sesión</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div id="carouselE" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#carouselE" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselE" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselE" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={imgBanner[0]} alt='logo' className='img-fluid' />
              <div className="carousel-caption ">
              </div>
            </div>
            <div className="carousel-item">
              <img src={imgBanner[1]} alt='logo' className='w-100' />
              <div className="carousel-caption">
              </div>
            </div>
            <div className="carousel-item">
              <img src={imgBanner[2]} alt='logo' className='w-100' />
              <div className="carousel-caption">
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselE" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselE" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <div className='container mt-5  mb-5 col-md-7 '>
          <h2 className="text-center mb-6 text-white pb-3 border-bottom border-danger border-3 title-underline ">
            Bienvenido a la Federación Hondureña
          </h2>
        </div>
        <img src={sambomobil} alt='logo' className='card-img  d-block d-md-none' />

        <div id="contendorletras" className='Container mt-5 mb-5 d-none d-md-block'>
          <div className="row justify-content-center text-center m-0">

            <div className="col-sm-2">
              <div className="card my-card dark-gray-card custom-card">
                <div className="card-body">
                  <h5 className="card-title text-center">Superación</h5>
                  <p className="card-text "> Superación personal, superación de límites</p>
                </div>
                <img src={S} alt='logo' className='card-img' />
              </div>
            </div>

            <div className="col-sm-2">
              <div className="card my-card dark-gray-card custom-card">
                <img src={A} alt='logo' className='card-img' />
                <div className="card-body">
                  <h5 className="card-title text-center">Aprendizaje</h5>
                  <p className="card-text">Constante y nuevas técnicas combate.</p>
                </div>
              </div>
            </div>

            <div className="col-sm-2">
              <div className="card my-card dark-gray-card custom-card">
                <div className="card-body">
                  <h5 className="card-title text-center">Maestría</h5>
                  <p className="card-text">Domina las técnicas para destacar en la competición.</p>
                </div>
                <img src={M} alt='logo' className='card-img' />
              </div>
            </div>

            <div className="col-sm-2">
              <div className="card my-card dark-gray-card custom-card">
                <img src={B} alt='logo' className='card-img' />
                <div className="card-body">
                  <h5 className="card-title text-center">Bienestar </h5>
                  <p className="card-text">Fomentando la salud física y mental.</p>
                </div>
              </div>
            </div>

            <div className="col-sm-2">
              <div className="card my-card dark-gray-card custom-card">
                <div className="card-body">
                  <h5 className="card-title text-center">Oportunidad</h5>
                  <p className="card-text ">Dominio en tácticas de ataque y defensa.</p>
                </div>
                <img src={O} alt='logo' className='card-img' />
              </div>
            </div>

          </div>
        </div>

        <div className='noticias -danger mt-1 p-1 pb-1 '>
          <div className='container' >
            <div className='container mt-5  col-md-7'>
              <h1 className="text-center font-bold mb-0 text-white pb-3 border-bottom border-danger border-3 title-underline ">
                Noticias
              </h1>
            </div>
            <div className="mb-4 custom-card  overflow-auto pb-0 border-bottom border-danger border-3 title-underline" style={{ maxHeight: '510px' }}>
              <div className="card-body mt-2">
                <PostsList tipo='noticias' />
              </div>
            </div>
          </div>
        </div>

        <div className='container -danger mt-1 p-1 pb-1 '>
          <div>
            <div className='container mt-5  col-md-7'>
              <h1 className="text-center font-bold mb-0 text-white pb-3 border-bottom border-danger border-3 title-underline ">
                Últimas Participaciones
              </h1>
            </div>
            <div className="mb-4 custom-card  overflow-auto pb-0 border-bottom border-danger border-3 title-underline" style={{ maxHeight: '510px' }}>
              <div className="card-body mt-2">
                <PostsList tipo='participaciones' />
              </div>
            </div>
          </div>
        </div>
        <hr />

        <div id="acercaDe" className="container-fluid text-white py-5 bg-img">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <h2 className='text-center'>Federación Hondureña de Sambo</h2>
                <p className='mt-4 h5'>Fundada con el objetivo de fomentar el crecimiento y desarrollo del sambo en el país, la federación se dedica a proporcionar un ambiente seguro y profesional para la práctica y competición del sambo.</p>
              </div>
              <div className="col-md-6 d-flex justify-content-center align-items-center">

                <img id='info-footer' src={acercaDeImg} alt='imagen acerca de' className='banner corner-cut' />

              </div>
            </div>
          </div>
        </div>


        <div className='container text-center text-white'>
          <h4 className='mb-3 text-center font-bold mb-6 text-white'>Síguenos en redes sociales</h4>
          <p>
            <a href="https://www.instagram.com/fedehsambo/?igsh=d3lxNmNiaWFxcXk2" target="_">
              <img src={iconoinstagram} alt='Instagram' className='social-icon instagram-icon' />
            </a>

            <a href="https://www.facebook.com/SamboHondurasOficial" target="_">
              <img src={iconofacebook} alt='Facebook' className='social-icon facebook-icon' />
            </a>
          </p>
        </div>



        <footer className="footer bg-danger text-light py-4">
          <div className="container text-center">
            <p> Copyright &copy; <span className='year '>{year}</span> Todos los derechos reservados Federación Hondureña de Sambo. </p>

          </div>
        </footer>

      </div>

    </>
  )
}
import './css/maestros.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import formatearFecha from '../helpers/formaterFecha';
const Swal = window.Swal;

const urlApi = import.meta.env.VITE_URL + '/api/Maestros';

export const Maestros = () => {
  const [dataMaestro, setDataMaestro] = useState([]);
  const [editarMaestro, setEditarMaestro] = useState(false)
  const [maestroSeleccionado, setMaestroseleccionada] = useState(null);

  const getDataMaestro = async () => {
    const result = await axios.get(urlApi, { withCredentials: true })
    setDataMaestro(result.data);
  }

  const registrarMaestro = async (event) => {
    event.preventDefault()

    const formData = {
      NombreMaestro: document.forms["MaestroForm"]["NombreMaestro"].value,
      dni: document.forms["MaestroForm"]["dni"].value
    };
    try {
      const response = await axios.post(urlApi, formData, { withCredentials: true });
      Swal.fire({
        title: response.data.msg,
        showConfirmButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error al registrar al Maestro", error);
    }
  };

  const limpiarFormulario = () => {
    const form = document.forms['MaestroForm'];
    form['NombreMaestro'].value = '';
    form['dni'].value = '';
    setEditarMaestro(false)
  };


  const updateMaestro =  (maestro) => {
   setMaestroseleccionada(maestro)
    const modal = new window.bootstrap.Modal(document.querySelector('#maestrosModalRegistrar'));
    modal.show();
    setEditarMaestro(true)

    document.forms["MaestroForm"]["NombreMaestro"].value=maestro.nombremaestro
    document.forms["MaestroForm"]["dni"].value=maestro.dni
  }


  
  const actualizarMaestro = async () =>{
    const url = urlApi +'/'+maestroSeleccionado.maestroid;  
    const formData = {
      NombreMaestro: document.forms["MaestroForm"]["NombreMaestro"].value,
     
    };

    console.log(formData);
    Swal.fire({
      title: "¿Seguro que quiere actualizar la informacion del Maestro?",
      showDenyButton: true,
      confirmButtonText: "Actualizar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
       await axios.put(url, formData, { withCredentials: true });
        Swal.fire({
          title: "DATOS ACTUALIZADOS",
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Operación cancelada", "", "info");
      }
    });
  }


  const eliminarMaestro = (id) => {
    Swal.fire({
      title: "Quiere eliminar este maestro?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `No eliminar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete((urlApi + `/${id}`), { withCredentials: true })
        Swal.fire({
          title: "Maestro eliminado",
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Operacion cancelada", "", "info");
      }
    });
  }



  useEffect(() => {
    getDataMaestro();
  }, [])


  return (
    <>
      <section className='w-100 h-auto d-flex flex-column align-items-center'>
        <div className='d-flex w-75 mt-5 justify-content-between'>
          <h2 className='text-center fw-bold'>Maestros</h2>
          <div>
            <button className='btn btn-success' type="btn" data-bs-toggle="modal" data-bs-target="#maestrosModalRegistrar">Registrar Maestro</button>
          </div>
        </div>

        {/* Mostrar tabla en dispositivos moviles */}
        <div id='lista-maestros' className="w-75">
          <div className="d-md-none mt-4">
            <ul className="list-group" >
              {dataMaestro.map((p) => (
                <li key={p.maestroid} className="list-group-item">
                  <div className='d-flex justify-content-between'>
                    <p>{p.nombremaestro}</p>
                    
                      <button className="btn " onClick={() => setMaestroseleccionada(p)} data-bs-toggle="modal" data-bs-target="#detalleUsuarioModal" >
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-clipboard-data" width="44" height="44" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" />
                          <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" />
                          <path d="M9 17v-4" />
                          <path d="M12 17v-1" />
                          <path d="M15 17v-2" />
                          <path d="M12 17v-1" />
                        </svg>
                      </button>
                    </div>
                  
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Detalle de usuario Modal */}
        <div className="modal fade" id="detalleUsuarioModal" tabIndex="-1" aria-labelledby="detalleUsuarioModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="detalleUsuarioModalLabel"> Detalles del Maestro </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {maestroSeleccionado && (
                  <>
                    <p>
                      <strong>Nombre de Maestro:</strong> {maestroSeleccionado.nombremaestro}
                    </p>
                    <p>
                      <strong>Dni:</strong> {maestroSeleccionado.dni}
                    </p>
                    <div className="mt-3">
                      <button  className="btn btn-warning" type="button" onClick={() => updateMaestro(maestroSeleccionado)}>Editar</button>
                      <button className="btn btn-danger" type="button" onClick={() => eliminarMaestro(maestroSeleccionado.maestroid)}> Eliminar </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mostrar tabla en dispositivos de escritorio */}
        <div id="lista-escuelas" className="col-sm-8 d-none d-md-block">
          <table className="table border TblShadw table-hover">
            <thead className='encabezadoTabla'>
              <tr>
                <th scope="col" className="text-center col-sm-2">Nombre Del Maestro</th>
                <th scope="col" className="text-center col-sm-2">Numero de ID</th>
                <th scope="col" className="text-center col-sm-2">Ingreso A la Escuela</th>
                <th scope="col" className="text-center col-sm-2">Editar</th>
                <th scope="col" className="text-center col-sm-2">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {dataMaestro.map((p) => (
                <tr key={p.maestroid}>
                  <td>{p.nombremaestro}</td>
                  <td>{p.dni}</td>
                  <td>{formatearFecha(p.created_date)}</td>
                  <td className='text-center'><button type="button" className="btn btn-warning" onClick={() => { updateMaestro(p) }}>Editar</button></td>
                  <td className='text-center'><button className='btn btn-danger' type="button" onClick={() => { eliminarMaestro(p.maestroid) }} >Eliminar</button> </td>
                   </tr>
              ))}

            </tbody>
          </table>
        </div>
      </section>

      <div className="modal fade" id="maestrosModalRegistrar" tabIndex="-1" aria-labelledby="maestrosModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="maestrosModalLabel">{editarMaestro?"Actualizar Maestro":"Registro de Maestro"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={limpiarFormulario} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form name="MaestroForm">
                <div className="form-group mb-3">
                  <label className='mb-1 mx-2' >Nombre de Maestro</label>
                  <input type="text" className="form-control" name="NombreMaestro" placeholder="Ingrese el nombre del maestro" required />
                </div>
                <div className="form-group mb-3">
                  <label className='mb-1 mx-2'>DNI</label>
                  <input type="texto" className="form-control" name="dni" disabled={editarMaestro}  placeholder="Ingrese el Id del maestro" required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() =>{limpiarFormulario()}} data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" onClick={editarMaestro? actualizarMaestro : registrarMaestro}>{editarMaestro?"Actualizar":"Registrar"}</button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

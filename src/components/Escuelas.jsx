import { useState, useEffect } from "react";
import axios from 'axios';
import formatearFecha from "../helpers/formaterFecha";
const Swal = window.Swal;
const urlApi = import.meta.env.VITE_URL;

export const Escuelas = () => {

  const [maestros, setMaestros] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [maestro, setMaestro] = useState("");
  const [escuelaSelected, setEscuelaSelected] = useState({});
  const [edited, setEdited] = useState(false);
  const [ubicacion, setUbicacion] = useState('');
  const [escuela, setEscuela] = useState({});
  const [editarEscuelaB, seteditarEscuelaB] = useState(false)


  const obtenerMaestros = async () => {
    try {
      const url = urlApi + "/api/Maestros";
      const response = await axios.get(url, { withCredentials: true });
      setMaestros(response.data);

    } catch (error) {
      // console.error("Error al obtener los maestros", error);
    }
  };

  const obtenerEscuelas = async () => {
    try {
      const url = urlApi + "/api/escuelas";
      const response = await axios.get(url, { withCredentials: true });
      setEscuelas(response.data);

    } catch (error) {
      // console.error("Error al obtener las escuelas", error);
    }
  };

  const registrarEscuela = async () => {
    const url = urlApi + "/api/escuelas";
    event.preventDefault()

    const formData = {
      NombreEscuela: document.forms["EscuelasForm"]["NombreEscuela"].value,
      MaestroID: document.forms["EscuelasForm"]["MaestroID"].value,
      Ubicacion: document.forms["EscuelasForm"]["Ubicacion"].value,
      created_at: document.forms["EscuelasForm"]["created_at"].value
    };

    // console.log(formData);
    try {
      const response = await axios.post(url, formData, { withCredentials: true });
      Swal.fire({
        title: response.data.msg,
        showConfirmButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      // console.error("Error al registrar la escuela", error);
    }

  };

  async function updataEscuela() {
    const url = urlApi + `/api/Escuelas/${escuela.id}`;

    try {
      await axios.put(url, { NombreEscuela: document.forms["EscuelasForm2"]["NombreEscuela2"].value, MaestroID: maestro, Ubicacion: ubicacion, created_at: document.forms["EscuelasForm2"]["created_at"].value }, { withCredentials: true });
      Swal.fire({
        title: '¡Escuela Actualizada!',
        icon: 'success'

      });
    } catch (error) {
      // console.error("Error al actualizar ", error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar escuela',
        icon: 'error'
      });
    }
    window.location.reload();
  };

  function edit_escuela(school) {
    setEscuela(school)
    const modal = new window.bootstrap.Modal(document.querySelector('#EditEscuela'));
    modal.show();
    seteditarEscuelaB(true)

    setUbicacion(school.ubicacion);
    setMaestro(school.maestroid)
    document.forms["EscuelasForm2"]["NombreEscuela2"].value = school.nombreescuela
    document.forms["EscuelasForm2"]["created_at"].value = school.created_at.split('T')[0]

  }

  const limpiarFormulario = () => {
    setMaestro('');
    setEscuela('');
    setUbicacion('');
    const form = document.forms['EscuelasForm'];
    form['NombreEscuela'].value = '';
    form['MaestroID'].value = '';
    form['Ubicacion'].value = '';
    form['created_at'].value = '';
    seteditarEscuelaB(false)
    // console.log(editarEscuelaB);
  };

  const borrarEscuela = (id) => {

    const url = urlApi + `/api/Escuelas/${parseInt(id)}`

    Swal.fire({
      title: "Quiere borrar la escuela?",
      ShowDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `No eliminar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(url, { withCredentials: true })
        Swal.fire({
          title: "Escuela eliminada",
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

  const [Escuelaseleccionada, setEscuelaseleccionada] = useState(null);

  useEffect(() => {
    obtenerMaestros();
    obtenerEscuelas();

  }, []);

  return (
    <>
      <section className='w-100 h-auto d-flex flex-column align-items-center'>
        <div className='d-flex w-75 mt-5 justify-content-between'>
          <h2 className='text-center fw-bold '>Escuelas Registradas</h2>
          <div>

            <button className='btn btn-success' type="button" data-bs-toggle="modal" data-bs-target="#escuelasModalRegistrar">Registrar escuela</button>
          </div>
        </div>
        {/* Mostrar tabla en dispositivos moviles */}

        <div className="lista-escuelas mt-4 w-75" >
          <div className="d-md-none ">
            <ul className="list-group" >
              {escuelas.map((escuela) => (
                <li key={escuela.id} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <p>{escuela.nombreescuela}</p>
                    <div>
                      <button className="btn " onClick={() => setEscuelaseleccionada(escuela)} data-bs-toggle="modal" data-bs-target="#detalleUsuarioModal" >
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Mostrar tabla en dispositivos de escritorio */}

        <div id="lista-escuelas" className="w-75 d-none d-md-block">
          <table className="table border TblShadw table-hover">
            <thead>
              <tr>
                <th scope="col" className="text-center col-sm-2"> Nombre Escuela </th>
                <th scope="col" className="text-center col-sm-2"> Nombre Maestro</th>
                <th scope="col" className="text-center col-sm-2"> Ubicacion </th>
                <th className="text-center col-sm-2" scope="col"> Fecha de Creacion </th>

                <th className="text-center col-sm-2" scope="col" colSpan={"2"}>Configuracion </th>
              </tr>

            </thead>
            <tbody>
              {escuelas.map((escuela) => (
                <tr key={escuela.id}>
                  <td className="col-sm-2">{escuela.nombreescuela}</td>
                  <td>{escuela.nombremaestro}</td>
                  <td className="d-none d-md-table-cell">{escuela.ubicacion}</td>
                  <td>{formatearFecha(escuela.created_at)}</td>
                  <td><button className='btn btn-warning' onClick={() => edit_escuela(escuela)} >Editar Escuela</button></td>
                  <td><button className='btn btn-danger' onClick={() => borrarEscuela(escuela.id)}>Borrar Escuela</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>



      </section>
      {/*Registro de escuela */}
      <div className="modal fade" id="escuelasModalRegistrar" tabIndex="-1" aria-labelledby="escuelasModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fw-bold fs-5" id="escuelasModalLabel">Registro De Escuela</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => { seteditarEscuelaB(false), limpiarFormulario() }} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form name="EscuelasForm">
                <div className="form-group mb-3">
                  <label className='mb-1 fw-bold mx-2' >Nombre de escuela</label>
                  <input type="text" className="form-control" name="NombreEscuela" placeholder="Ingrese el nombre de la escuela" required />
                </div>

                <label className='mx-2 fw-bold mb-1'>Maestro</label>
                <select className='form-control mb-2' name='MaestroID' value={maestro} onChange={(event) => setMaestro(event.target.value)}>
                  <option value="" disabled>Seleccionar un maestro</option>
                  {maestros.map((maestro) => (
                    <option key={maestro.maestroid} value={maestro.maestroid}>
                      {maestro.nombremaestro}
                    </option>
                  ))}
                </select>

                <div className="form-group mb-3">
                  <label className='mb-1 fw-bold mx-2' >Ubicación de escuela</label>
                  <input type="text" className="form-control" name="Ubicacion" placeholder="Ingrese la ubicación de la escuela" required />
                </div>

                <div className="form-group mb-3">
                  <label className='mb-1 mx-2 fw-bold' >Fecha De Ingreso A la Escuela</label>
                  <input type="date" name='created_at' className='form-control mb-2' required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { seteditarEscuelaB(false), limpiarFormulario() }} >Cancelar</button>
              <button type="button" onClick={registrarEscuela} className="btn btn-primary">Registrar Escuela</button>
            </div>
          </div>
        </div>
      </div>

      {/* Detalle de usuario Modal */}
      <div className="modal fade" id="detalleUsuarioModal" tabIndex="-1" aria-labelledby="detalleUsuarioModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="detalleUsuarioModalLabel"> Detalles de la Escuela </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {Escuelaseleccionada && (
                <>
                  <p>
                    <strong>Nombre de Escuela:</strong> {Escuelaseleccionada.nombreescuela}
                  </p>
                  <p>
                    <strong>Nombre Maestro:</strong> {Escuelaseleccionada.nombremaestro}
                  </p>
                  <p>
                    <strong>Ubicacion:</strong> {Escuelaseleccionada.ubicacion}
                  </p>
                  <p>
                    <strong>Fecha Creacion:</strong> {formatearFecha(Escuelaseleccionada.created_at)}
                  </p>
                  <div className="mt-3">
                    <button className='btn btn-warning' onClick={() => edit_escuela(Escuelaseleccionada)} >Editar Escuela</button>
                    <button className="btn btn-danger mx-2" type="button" onClick={() => borrarEscuela(Escuelaseleccionada.id)}> Eliminar </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Inicio modal editar escuela */}
      <div className="modal fade" id="EditEscuela" tabIndex="-1" aria-labelledby="escuelasModal2Editar" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="escuelasModal2Editar">Editor de Escuela</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form name="EscuelasForm2">
                <div className="form-group mb-3">
                  <label className='mb-1 fw-bold mx-2' >Nombre de escuela</label>
                  <input type="text" className="form-control" name="NombreEscuela2" placeholder="Ingrese el nombre de la escuela" required />
                </div>

                <label className='mx-2 fw-bold mb-1'>Maestro</label>
                <select className='form-control mb-2' name='MaestroID' value={maestro} onChange={(event) => setMaestro(event.target.value)}>
                  <option value="" disabled>Seleccionar un maestro</option>
                  {maestros.map((maestro) => (
                    <option key={maestro.maestroid} value={maestro.maestroid}>
                      {maestro.nombremaestro}
                    </option>
                  ))}
                </select>

                <div className="form-group mb-3">
                  <label className='mb-1 fw-bold mx-2' >Ubicación de escuela</label>
                  <input value={ubicacion} onChange={e => setUbicacion(e.target.value)} type="text" className="form-control" name="Ubicacion" placeholder="Ingrese la ubicación de la escuela" required />
                </div>

                <div className="form-group mb-3">
                  <label className='mb-1 mx-2 fw-bold' >Fecha De Ingreso A la Escuela</label>
                  <input type="date" name='created_at' className='form-control mb-2' required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-danger" onClick={() => limpiarFormulario()} data-bs-dismiss="modal">Cancelar</button>
              <button type="button" onClick={() => updataEscuela()} className="btn btn-primary">Guardar cambios</button>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}




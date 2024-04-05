import { useState, useEffect } from 'react';
import './css/atletas.css';
import axios from 'axios';
import formatearFecha from '../helpers/formaterFecha';
const Swal = window.Swal;
const urlApi = import.meta.env.VITE_URL;

export const Torneos = () => {
  const [torneos, setTorneos] = useState([]);
  const [nuevoTorneo, setNuevoTorneo] = useState({ nombretorneo: '', lugar: '', fecha: '' });
  const [atletas, setAtletas] = useState([]);
  const [participantes, setParticipantes] = useState([]);
  const [nuevoParticipante, setNuevoParticipante] = useState({ atletaid: '', torneoid: '', puesto: '' });
  const [torneoSeleccionado, setTorneoSeleccionado] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editarTorneo, setEditarTorneo] = useState(false);
  const [torneoSelected, setTorneoSelected] = useState(null);



  const obtenerTorneos = async () => {
    try {
      const url = `${urlApi}/api/Torneos`;
      const response = await axios.get(url, { withCredentials: true });
      setTorneos(response.data.torneos);
    } catch (error) {
      console.error("Error al obtener los torneos", error);
    }
  };

  const obtenerParticipantesTorneo = async () => {
    try {
      if (torneoSeleccionado) {
        const url = `${urlApi}/api/Torneos/${torneoSeleccionado}/participantes`;
        const response = await axios.get(url, { withCredentials: true });
        setParticipantes(response.data.participanteTorneo);
      }
    } catch (error) {
      console.error("Error al obtener los participantes del torneo", error);
    }
  };

  const registrarTorneo = async () => {
    const url = `${urlApi}/api/Torneos`;
    event.preventDefault();

    const formData = {
      nombretorneo: document.forms["torneoform"]["nombretorneo"].value,
      lugar: document.forms["torneoform"]["lugar"].value,
      fecha: document.forms["torneoform"]["fecha"].value,
    };

    try {
      const response = await axios.post(url, formData, { withCredentials: true });
      Swal.fire({
        title: response.data.msg,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error al registrar el torneo", error);
    }
  };

  const updateTorneo = (torneo) => {
    setTorneoSelected(torneo)
    const modal = new window.bootstrap.Modal(document.querySelector('#torneoModal'));
    modal.show();
    setEditarTorneo(true)

    document.forms["torneoform"]["nombretorneo"].value = torneo.nombretorneo
    document.forms["torneoform"]["lugar"].value = torneo.lugar
    document.forms["torneoform"]["fecha"].value = torneo.fecha.split('T')[0]
  }

  const limpiarFormulario = () => {
    const form = document.forms['torneoform'];
    form['nombretorneo'].value = '';
    form['lugar'].value = '';
    form['fecha'].value = '';
  };

  const actualizarTorneo = async () => {
    const url = `${urlApi}/api/Torneos/${torneoSelected.torneoid}`;
    const formData = {
      NombreTorneo: document.forms["torneoform"]["nombretorneo"].value,
      Lugar: document.forms["torneoform"]["lugar"].value,
      Fecha: document.forms["torneoform"]["fecha"].value
    };

    Swal.fire({
      title: "¿Seguro que quiere actualizar la informacion del Torneo?",
      showDenyButton: true,
      confirmButtonText: "Actualizar",
      denyButtonText: `Cancelar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(url, formData, { withCredentials: true });
        Swal.fire({
          title: "Datos Actualizados",
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

  const eliminarTorneo = async () => {
    const url = `${urlApi}/api/Torneos/${torneoSelected.torneoid}`;

    try {
      const result = await Swal.fire({
        title: '¿Quiere borrar el torneo?',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'No Eliminar',
      });

      if (result.isConfirmed) {
        await axios.delete(url, { withCredentials: true });
        Swal.fire({
          title: 'Torneo eliminado',
          showConfirmButton: true,
        }).then(() => {
          obtenerTorneos();
          window.location.reload(); // Actualizar la lista después de eliminar
        });
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info');
      }
    } catch (error) {
      console.error('Error al eliminar el torneo', error);
    }
  };

  const obtenerAtletas = async () => {
    try {
      const url = urlApi + "/api/atleta";
      const response = await axios.get(url, { withCredentials: true });
      setAtletas(response.data.atletas);
    } catch (error) {
      console.error("Error al obtener los atletas", error);
    }
  };

  const registrarParticipante = async () => {
    const url = `${urlApi}/api/Participantes`;
    event.preventDefault();

    const formData = {
      atleta_id: nuevoParticipante.atletaid,
      torneo_id: nuevoParticipante.torneoid,
      lugar: nuevoParticipante.puesto,
    };

    try {
      const response = await axios.post(url, formData, { withCredentials: true });
      Swal.fire({
        title: '¡Participante ingresado correctamente!',
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error al registrar el participante", error);
    }
  };

  const eliminarParticipante = async (id) => {
    const url = `${urlApi}/api/Participantes/${id}`;

    try {
      const result = await Swal.fire({
        title: '¿Quiere borrar el Participante?',
        showDenyButton: true,
        confirmButtonText: 'Eliminar',
        denyButtonText: 'No eliminar',
      });

      if (result.isConfirmed) {
        await axios.delete(url, { withCredentials: true });
        Swal.fire({
          title: 'Participante Eliminado',
          showConfirmButton: true,
        }).then(() => {
          obtenerParticipantesTorneo();
        });
      } else if (result.isDenied) {
        Swal.fire('Operación cancelada', '', 'info');
      }
    } catch (error) {
      console.error('Error al eliminar el Participante', error);
    }
  };

  const abrirModalAgregarParticipantes = (torneoId) => {
    setNuevoParticipante({
      ...nuevoParticipante,
      torneoid: torneoId,
    });
    setShowModal(true);
  };

  useEffect(() => {
    obtenerTorneos();
    obtenerAtletas();
    if (torneoSeleccionado !== null && torneoSeleccionado !== undefined) {
      obtenerParticipantesTorneo(torneoSeleccionado);
    }
  }, [torneoSeleccionado]);



  return (
    <>
      <section className='w-100 h-auto d-flex flex-column align-items-center'>
        <div className='d-flex w-75 mt-5 justify-content-between'>
          <h2 className='text-center fw-bold'>Torneos</h2>
          <div>
            <button className='btn btn-success mb-4' type='button' data-bs-toggle='modal' data-bs-target='#torneoModal'>
              Registrar Torneo
            </button>
          </div>
        </div>

        <div id='lista-torneos'>
          {/* Mostrar lista en dispositivos móviles */}
          <div className="d-md-none">
            <ul className="list-group">
              {torneos.map((torneo) => (
                <li key={torneo.torneoid} className="list-group-item">
                  <div className='d-flex flex-column'>
                    <p>
                      <strong>Nombre del Torneo:</strong> {torneo.nombretorneo}<br />
                      <strong>Lugar del Torneo:</strong> {torneo.lugar}<br />
                      <strong>Fecha del Torneo:</strong> {formatearFecha(torneo.fecha)}
                    </p>
                    <div className='d-flex justify-content-between'>
                      <button type="button" className="btn btn-warning" onClick={() => { updateTorneo(torneo) }}>Editar Torneo</button>
                      <button className='btn btn-primary btn-sm mx-2' type='button' data-bs-toggle='modal' data-bs-target='#agregarparticipante' onClick={() => abrirModalAgregarParticipantes(torneo.torneoid)}>
                        + Participantes
                      </button>
                      <button className='btn btn-primary btn-sm' type='button' data-bs-toggle='modal' data-bs-target='#modalparticipantes' onClick={() => { setTorneoSeleccionado(torneo.torneoid); obtenerParticipantesTorneo(); }}>
                        Ver Participantes
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Mostrar lista en escritorio */}
          <div className='w-100 h-100 d-flex justify-content-center'>
            <div className="d-none d-md-block w-85">
              <table className="table border TblShadw table-hover">
                <thead>
                  <tr>
                    <th style={{ width: '200px' }} scope='col'>Nombre de Torneo</th>
                    <th scope='col'>Lugar</th>
                    <th scope='col'>Fecha</th>
                    <th className='text-center' scope='col'> Editar </th>
                    <th className='text-center' scope='col'> Agregar Participante </th>
                    <th className='text-center' scope='col'> Ver Participantes </th>
                  </tr>
                </thead>
                <tbody>
                  {torneos.map((torneo) => (
                    <tr key={torneo.torneoid}>
                      <td className='textcenter'>{torneo.nombretorneo}</td>
                      <td className='textcenter'>{torneo.lugar}</td>
                      <td className='textcenter'>{formatearFecha(torneo.fecha)}</td>
                      <td className='text-center'><button type="button" className="btn btn-warning" onClick={() => { updateTorneo(torneo) }}>Editar Torneo</button></td>
                      <td className='text-center'>
                        <button className='btn btn-primary' type='button' data-bs-toggle='modal' data-bs-target='#agregarparticipante' onClick={() => abrirModalAgregarParticipantes(torneo.torneoid)}>
                          Agregar Participante
                        </button>
                      </td>
                      <td className='text-center'>
                        <button className='btn btn-primary' type='button' data-bs-toggle='modal' data-bs-target='#modalparticipantes' onClick={() => { setTorneoSeleccionado(torneo.torneoid); obtenerParticipantesTorneo(); }}>
                          Ver Participantes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <div className="modal fade" id="torneoModal" tabIndex="-1" aria-labelledby="TorneosModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="torneoModal">{editarTorneo ? "Actualizar Torneo" : "Registro de Torneos"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form name="torneoform">
                <div className="form-group mb-3">
                  <label className='mx-2 fw-bold mb-1'>Nombre del Torneo</label>
                  <input type='text' id='nombreTorneo' className='form-control mb-2' name='nombretorneo' placeholder='Ingrese el nombre del Torneo' required />
                </div>
                <div className="form-group mb-3">
                  <label className='mx-2 fw-bold mb-1'>Lugar del Torneo</label>
                  <input type='text' id='lugarTorneo' className='form-control mb-2' name='lugar' placeholder='Ingrese el lugar del Torneo' required />
                </div>
                <div className="form-group mb-3">
                  <label className='mx-2 fw-bold mb-1'>Fecha del Torneo</label>
                  <input type='date' id='fechaTorneo' className='form-control mb-2' name='fecha' placeholder='Ingrese la fecha del Torneo' required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => { setEditarTorneo(false), limpiarFormulario() }} data-bs-dismiss="modal">Close</button>
              <button type="submit" className="btn btn-primary" onClick={editarTorneo ? actualizarTorneo : registrarTorneo}>{editarTorneo ? "Actualizar" : "Registrar"}</button>
              {editarTorneo && <button type='button' className='btn btn-danger' onClick={eliminarTorneo}>Eliminar</button>}
            </div>
          </div>
        </div>
      </div>

      <div className='modal fade' id='agregarparticipante' tabIndex='-1'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5'>Registro de Participantes</h1>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <form id='participanteform' onSubmit={registrarParticipante}>
                <label className='mx-2 fw-bold mb-1'>Seleccione el Atleta</label>
                <select id='atleta' className='form-control mb-2' name='atletaid' placeholder='Seleccione un Atleta' onChange={(ev) => setNuevoParticipante({ ...nuevoParticipante, atletaid: ev.target.value })}
                  value={nuevoParticipante.atletaid} required>
                  <option value="" disabled>Selecciona un atleta</option>
                  {atletas.map((atleta) => (
                    <option key={atleta.atletaid} value={atleta.atletaid}>
                      {`${atleta.nombre} ${atleta.apellidos}`}
                    </option>
                  ))}
                </select>
                <label className='mx-2 fw-bold mb-1'>Puesto del Participante</label>
                <input type='number' id='puesto' className='form-control mb-2' name='puesto' onChange={(ev) => setNuevoParticipante({ ...nuevoParticipante, puesto: ev.target.value })}
                  value={nuevoParticipante.puesto} required />
                <button type='submit' className='btn btn-primary'>
                  Registrar Participante
                </button>
              </form>
            </div>
            <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='modal fade' id='modalparticipantes' tabIndex='-1'>
        <div className='modal-dialog modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h1 className='modal-title fs-5'>Participantes del Torneo</h1>
              <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
            </div>
            <div className='modal-body'>
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th style={{ width: '200px' }} scope='col'>Nombre de Atleta</th>
                    <th scope='col'>Categoría</th>
                    <th scope='col'>Lugar</th>
                    <th scope='col'>Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {participantes.map((participante) => (
                    <tr key={participante.participanteid}>
                      <td className='textcenter'>{participante.nombre} {participante.apellidos}</td>
                      <td className='textcenter'>{participante.nombre_categoria}</td>
                      <td className='textcenter'>{participante.lugar}</td>
                      <td>
                        <button className='btn btn-danger btn-sm' style={{ marginLeft: '15px' }} onClick={() => eliminarParticipante(participante.participanteid)}>
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};



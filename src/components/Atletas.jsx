import { useState, useEffect } from 'react';
import './css/atletas.css';
import formatearFecha from '../helpers/formaterFecha';
import axios from 'axios';
const Swal = window.Swal;

const urlApi = import.meta.env.VITE_URL;

export const Atletas = () => {
  const [categorias, setCategorias] = useState([]);
  const [grados, setGrados] = useState([]);
  const [maestros, setMaestros] = useState([]);
  const [escuelas, setEscuelas] = useState([]);
  const [genero, setGenero] = useState("");
  const [categoria, setCategoria] = useState("");
  const [grado, setGrado] = useState("");
  const [maestro, setMaestro] = useState("");
  const [escuela, setEscuela] = useState("");
  const [atletas, setAtletas] = useState([]);
  const [selectedAtleta, setSelectedAtleta] = useState(null);
  const [editarAtleta, setEditarAtleta] = useState(false)

  const obtenerAtletas = async () => {
    try {
      const url = urlApi + "/api/atleta";
      const response = await axios.get(url, { withCredentials: true });
      setAtletas(response.data.atletas);
    } catch (error) {
      console.error("Error al obtener los atletas", error);
    }
  };

  const borrarAtleta = (id) => {
    const url = urlApi + `/api/atleta/${parseInt(id)}`;

    Swal.fire({
      title: "¿Quieres borrar el atleta?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: `No eliminar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(url, { withCredentials: true })
        Swal.fire({
          title: "Atleta eliminado",
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            obtenerAtletas()
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Operación cancelada", "", "info");
      }
    });
  }

  const obtenerCategorias = async () => {
    try {
      const url = urlApi + "/api/categoria";
      const response = await axios.get(url, { withCredentials: true });
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías", error);
    }
  };

  const obtenerGrados = async () => {
    try {
      const url = urlApi + "/api/grado";
      const response = await axios.get(url, { withCredentials: true });
      setGrados(response.data);
    } catch (error) {
      console.error("Error al obtener los grados", error);
    }
  };

  const obtenerMaestros = async () => {
    try {
      const url = urlApi + "/api/maestros";
      const response = await axios.get(url, { withCredentials: true });
      setMaestros(response.data);
    } catch (error) {
      console.error("Error al obtener los maestros", error);
    }
  };

  const obtenerEscuelas = async () => {
    try {
      const url = urlApi + "/api/escuelas";
      const response = await axios.get(url, { withCredentials: true });
      setEscuelas(response.data);
    } catch (error) {
      console.error("Error al obtener las escuelas", error);
    }
  };

  const registrarAtleta = async () => {
    const url = urlApi + "/api/atleta";
    event.preventDefault()
    let escuelaIdValue = parseInt(document.forms["atletaForm"]["escuelaid"].value);
    let maestroIdValue = parseInt(document.forms["atletaForm"]["maestroid"].value);
  
    escuelaIdValue = escuelaIdValue === -1 ? null : escuelaIdValue;
    maestroIdValue = maestroIdValue === -1 ? null : maestroIdValue;
  
    const formData = {
      nombre: document.forms["atletaForm"]["nombre"].value,
      apellidos: document.forms["atletaForm"]["apellidos"].value,
      fecha_nacimiento: document.forms["atletaForm"]["fechaNacimiento"].value,
      grado_id: parseInt(document.forms["atletaForm"]["gradoid"].value),
      categoria_id: parseInt(document.forms["atletaForm"]["categoriaid"].value),
      dni: document.forms["atletaForm"]["dni"].value,
      escuela_id: escuelaIdValue,
      maestro_id: maestroIdValue
    };

    try {
      const response = await axios.post(url, formData, { withCredentials: true });
      Swal.fire({
        title: response.data.msg,
        showConfirmButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          hideModal()
          obtenerAtletas()
        }
      });
    } catch (error) {
      console.error("Error al registrar el atleta", error);
    }
  };

  const actualizarAtleta = async () =>{
    const url = urlApi + "/api/atleta/"+selectedAtleta.atletaid;
    let escuelaIdValue = parseInt(document.forms["atletaForm"]["escuelaid"].value);
    let maestroIdValue = parseInt(document.forms["atletaForm"]["maestroid"].value);
  
    escuelaIdValue = escuelaIdValue === -1 ? null : escuelaIdValue;
    maestroIdValue = maestroIdValue === -1 ? null : maestroIdValue;
    const formData = {
      nombre: document.forms["atletaForm"]["nombre"].value,
      apellidos: document.forms["atletaForm"]["apellidos"].value,
      fecha_nacimiento: document.forms["atletaForm"]["fechaNacimiento"].value,
      grado_id: parseInt(document.forms["atletaForm"]["gradoid"].value),
      escuela_id: escuelaIdValue,
      maestro_id: maestroIdValue,
      categoria_id: parseInt(document.forms["atletaForm"]["categoriaid"].value),
    };
    Swal.fire({
      title: "¿Seguro que quiere actualizar la informacion del atleta?",
      showDenyButton: true,
      confirmButtonText: "Actualizar",
      denyButtonText: `Cancelarr`
    }).then(async (result) => {
      if (result.isConfirmed) {
       await axios.put(url, formData, { withCredentials: true });
        Swal.fire({
          title: "DATOS ACTUALIZADOS",
          showConfirmButton: true
        }).then((result) => {
          if (result.isConfirmed) {
            hideModal()
            obtenerAtletas()
          }
        });
      } else if (result.isDenied) {
        Swal.fire("Operación cancelada", "", "info");
      }
    });
  }

   
  const updateModal =(atleta)=>{
    setSelectedAtleta(atleta)
    const modal = new window.bootstrap.Modal(document.querySelector('#atletasModal'));
    modal.show();
    setEditarAtleta(true)
    document.forms["atletaForm"]["nombre"].value=atleta.nombre
    document.forms["atletaForm"]["apellidos"].value=atleta.apellidos
    document.forms["atletaForm"]["fechaNacimiento"].value=atleta.fechanacimiento
    document.forms["atletaForm"]["dni"].value=atleta.dni
    setGenero(atleta.generoid)
    setCategoria(atleta.categoriaid)
    setGrado(atleta.gradoid)
    setMaestro(atleta.maestroid)
    setEscuela(atleta.escuelaid)
  }

  const limpiarFormulario = () => {
    setGenero(''); 
    setCategoria(''); 
    setGrado(''); 
    setMaestro('');
    setEscuela(''); 
    const form = document.forms['atletaForm'];
    form['nombre'].value = '';
    form['apellidos'].value = '';
    form['fechaNacimiento'].value = '';
    form['dni'].value = '';
    setEditarAtleta(false)
  };
  
 
  const hideModal = () => {
    const modalElement = document.getElementById('atletasModal'); // Asegúrate de usar el ID correcto de tu modal
    const bootstrapModal = window.bootstrap.Modal.getInstance(modalElement);
    if (bootstrapModal) {
      bootstrapModal.hide();
    }
  };

  useEffect(() => {
    obtenerCategorias();
    obtenerGrados();
    obtenerMaestros();
    obtenerEscuelas();
    obtenerAtletas();
    
  }, []);

  const handleGeneroChange = (event) => {
    setGenero(event.target.value);
    setCategoria("");
  };

  return (
    <>
      <section className='w-100 h-auto d-flex flex-column align-items-center'>
        <div className='d-flex w-75 mt-5 justify-content-between'>
          <h2 className='text-center fw-bold'>Atletas</h2>
          <div>
            <button className='btn btn-success' type="button" data-bs-toggle="modal" data-bs-target="#atletasModal">Registrar Atleta</button>
          </div>
        </div>

        <div id='lista-atletas'>
          {/* Mostrar lista en dispositivos móviles */}
          <div className="d-md-none">
            <ul className="list-group">
              {atletas.map((atleta) => (
                <li key={atleta.atletaid} className="list-group-item">
                  <div className='d-flex justify-content-between'>
                    <p>
                      {`${atleta.nombre} ${atleta.apellidos}`}
                    </p>
                    <button className='btn' onClick={() => setSelectedAtleta(atleta)} data-bs-toggle="modal" data-bs-target="#atletasModalDetalles">
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

          {/* Mostrar tabla en dispositivos de escritorio */}
          <div className="d-none d-md-block">
            <table className="table border TblShadw table-hover">
              <thead>
                <tr>
                  <th className='text-center' scope="col">Nombre Atleta</th>
                  <th className='text-center' scope="col">Fecha de Nacimiento</th>
                  <th className='text-center' scope="col">Grado</th>
                  <th className='text-center' scope="col">Categoria</th>
                  <th className='text-center' scope="col">Maestro</th>
                  <th className='text-center' scope="col">Escuela</th>
                  <th className='text-center' scope="col">Actualizar</th>
                  <th className='text-center' scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {atletas.map((atleta) => (
                  <tr key={atleta.atletaid}>
                    <td className='text-center'>{`${atleta.nombre} ${atleta.apellidos}`}</td>
                    <td className='text-center'>{formatearFecha(atleta.fechanacimiento)}</td>
                    <td className='text-center'>{atleta.grado}</td>
                    <td className='text-center'>{atleta.categoria}</td>
                    <td className='text-center'>{atleta.maestro}</td>
                    <td className='text-center'>{atleta.escuela}</td>
                    <td className='text-center'>
                      <button type='button' className='btn btn-warning' onClick={()=>updateModal(atleta)}>Editar Atleta</button>
                    </td>
                    <td className='text-center'>
                      <button className='btn btn-danger' onClick={() => borrarAtleta(atleta.atletaid)}>
                        Borrar Atleta
                      </button>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Modal para mostrar detalles en dispositivos móviles */}
      <div className="modal modal-static fade" id="atletasModalDetalles" tabIndex="-1" aria-labelledby="atletasModalDetallesLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="atletasModalDetallesLabel">Detalles del Atleta</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => setSelectedAtleta(null)}></button>
            </div>
            <div className="modal-body">
              {selectedAtleta && (
                <>
                  <p><strong>Nombre:</strong> {`${selectedAtleta.nombre} ${selectedAtleta.apellidos}`}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {selectedAtleta.fechanacimiento}</p>
                  <p><strong>Grado:</strong> {selectedAtleta.grado}</p>
                  <p><strong>Categoria:</strong> {selectedAtleta.categoria}</p>
                  <p><strong>Maestro:</strong> {selectedAtleta.maestro}</p>
                  <p><strong>Escuela:</strong> {selectedAtleta.escuela}</p>
                </>
              )}
            </div>
            <div className="modal-footer">
            <button type='button' className='btn btn-warning' onClick={()=>updateModal(selectedAtleta)}>Editar Atleta</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => { borrarAtleta(selectedAtleta.atletaid); setSelectedAtleta(null); }}> Eliminar Atleta</button>
            </div>

          </div>
        </div>
      </div>

      <div className="modal modal-static fade" id="atletasModal" tabIndex="-1" aria-labelledby="atletasModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="atletasModalLabel">{editarAtleta?"Actualizar Atleta":"Registro de Atleta"}</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={() => {setEditarAtleta(false),limpiarFormulario()}}></button>
            </div>
            <div className="modal-body">
              <form name="atletaForm">
                <label className='mx-2 fw-bold mb-1'>Nombre</label>
                <input type="text" name='nombre' className='form-control mb-2' required />
                <label className='mx-2 fw-bold mb-1'>Apellido</label>
                <input type="text" name='apellidos' className='form-control mb-2' required />
                <label className='mx-2 fw-bold mb-1'>Fecha Nacimiento</label>
                <input type="date" name='fechaNacimiento' className='form-control mb-2' required />
                <label className='mx-2 fw-bold mb-1'>Escriba su DNI</label>
                <input type="text" name='dni' className='form-control mb-2'  disabled={editarAtleta} required={!editarAtleta} />
                <label className='mx-2 fw-bold mb-1'>Seleccione el género</label>
                <select className='form-control mb-2' name='genero' value={genero} onChange={handleGeneroChange}>
                  <option value="" disabled>Seleccionar género</option>
                  <option value="1">Masculino</option>
                  <option value="2">Femenino</option>
                </select>
                <select className='form-control mb-2' required name='categoriaid' value={categoria} onChange={(event) => setCategoria(event.target.value)}>
                  <option value="" disabled>Seleccionar categoría de peso</option>
                  {genero &&
                    categorias
                      .filter((cat) => cat.generoid === parseInt(genero, 10))
                      .map((opcion) => (
                        <option key={opcion.categoriaid} value={opcion.categoriaid}>
                          {opcion.nombre_categoria}
                        </option>
                      ))}
                </select>
                <label className='mx-2 fw-bold mb-1'>Grado de cinta</label>
                <select className='form-control mb-2' name='gradoid' value={grado} onChange={(event) => setGrado(event.target.value)} required>
                  <option value="" disabled>Seleccionar un grado</option>
                  {grados.map((grado) => (
                    <option key={grado.gradoid} value={grado.gradoid}>
                      {grado.grado_cinturon}
                    </option>
                  ))}
                </select>
                <label className='mx-2 fw-bold mb-1'>Maestro</label>
                <select className='form-control mb-2' name='maestroid' value={maestro} onChange={(event) => setMaestro(event.target.value)} required>
                  <option value="" disabled>Seleccionar un maestro</option>
                  <option value="-1" >Sin maestro</option>
                  {maestros.map((maestro) => (
                    <option key={maestro.maestroid} value={maestro.maestroid}>
                      {maestro.nombremaestro}
                    </option>
                  ))}
                </select>
                <label className='mx-2 fw-bold mb-1'>Escuela</label>
                <select className='form-control mb-2' name='escuelaid' value={escuela} onChange={(event) => setEscuela(event.target.value)} required>
                  <option value="" disabled>Seleccionar una escuela</option>
                  <option value="-1" >Sin Escuela</option>
                  {escuelas.map((escuela) => (
                    <option key={escuela.id} value={escuela.id}>
                      {escuela.nombreescuela}
                    </option>
                  ))}
                </select>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() =>{ setEditarAtleta(false),limpiarFormulario()}} data-bs-dismiss="modal">Cerrar</button>
              <button type="button" onClick={editarAtleta? actualizarAtleta : registrarAtleta} className="btn btn-primary">{editarAtleta?"Actualizar":"Registrar"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

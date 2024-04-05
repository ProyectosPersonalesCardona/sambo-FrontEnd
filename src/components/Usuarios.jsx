import { useState, useEffect } from "react";
import axios from "axios";
import "./css/areaAdmin.css"

const Swal = window.Swal;
const urlApi = import.meta.env.VITE_URL;

export const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [registro, setRegistro] = useState({
    nombreusuario: "",
    contrasenia: "",
    confirmarContrasenia: "",
    nombreRol: "",
  });

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const url = urlApi + "/api/usuarios";
        const response = await axios.get(url, { withCredentials: true });
        const usuariosAjustados = response.data.map((usuario) => ({
          ...usuario,
          activo: usuario.activo ? "Activo" : "Desactivado",
        }));
        setUsuarios(usuariosAjustados);
      } catch (error) {
        console.error("Error al obtener los usuarios", error);
      }
    };
    obtenerUsuarios();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRegistro((prevRegistro) => ({
      ...prevRegistro,
      [name]: value,
    }));
  };

  const registrarUsuario = async () => {
    const url = urlApi + "/api/usuarios";
    try {
      if (registro.contrasenia !== registro.confirmarContrasenia) {
        Swal.fire({
          icon: "error",
          title: "Las contraseñas no coinciden",
          text: "Corrige las contraseñas",
        });
        return;
      }
      const data = {
        nombreusuario: registro.nombreusuario,
        contrasenia: registro.contrasenia,
        nombrerol: registro.nombreRol,
      };
      await axios.post(url, data, { withCredentials: true });
      Swal.fire({
        title: "Registro exitoso",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error al registrar el usuario", error);
    }
  };

  const eliminarUsuario = async (id) => {
    const url = urlApi + `/api/usuarios/${id}`;
    try {
      await axios.delete(url, { withCredentials: true });
      Swal.fire({
        title: "Usuario eliminado con éxito",
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error("Error al eliminar el usuario", error);
    }
  };

  const toggleEstadoUsuario = async (id, estadoActual) => {
    const url = urlApi + `/api/usuarios`;
    const estadoActualBool = estadoActual === 'Activo';
    const nuevoEstado = !estadoActualBool;
    
    const data = {
      userid: id,
      activo: nuevoEstado,
    };
    
    try {
      await axios.put(url, data, { withCredentials: true });
      Swal.fire({
        title: `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} con éxito`,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      console.error(`Error al ${nuevoEstado ? 'activar' : 'desactivar'} el usuario`, error);
    }
};



  return (
    <>
      <section className="w-100 h-auto d-flex flex-column align-items-center">
        <div className="d-flex w-75 mt-5 justify-content-between">
          <h2 className="text-center fw-bold">Usuarios</h2>
          <div>
            <button className="btn btn-success" type="button" data-bs-toggle="modal" data-bs-target="#usuariosModal"> Registrar Usuario </button>
          </div>
        </div>

        <div id="lista-usuarios" className="w-75">
           {/* Detalle de usuario en dispositivos móviles */}
        <div className="d-md-none mt-4">
          <ul className="list-group">
            {usuarios.map((usuario) => (
              <li key={usuario.userid} className="list-group-item">
                <div className="d-flex justify-content-between">
                  <p>{usuario.nombreusuario}</p>
                  <div>
                    <button className="btn " onClick={() => setUsuarioSeleccionado(usuario)} data-bs-toggle="modal" data-bs-target="#detalleUsuarioModal" >
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

        {/* Mostrar tabla en dispositivos de escritorio */}
        <div id="lista-usuarios" className="d-md-block  d-flex justify-content-center">
          <table className="table border TblShadw table-hover">
            <thead>
              <tr>
                <th scope="col" className="text-center col-sm-2"> Usuario </th>
                <th scope="col" className="text-center col-sm-2"> Rol </th>
                <th scope="col" className="text-center col-sm-2"> Estado </th>
                <th className="text-center col-sm-2" scope="col"> Desactivar </th>
                <th className="text-center col-sm-2" scope="col" > Eliminar </th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.userid}>
                  <td className="col-sm-2">{usuario.nombreusuario}</td>
                  <td>{usuario.rol}</td>
                  <td className="d-none d-md-table-cell">{usuario.activo}</td>
                  <td className="text-center">
                  <button
                    className={`btn ${usuario.activo === 'Activo' ? 'btn-warning' : 'btn-success w-75'} me-2`}
                    type="button"
                    onClick={() => toggleEstadoUsuario(usuario.userid, usuario.activo)}
                  >
                    {usuario.activo === 'Activo' ? 'Desactivar' : 'Activar'}
                  </button>

                  </td>
                  <td className="text-center">
                    <button className="btn btn-danger" type="button" onClick={() => eliminarUsuario(usuario.userid)}> Eliminar </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        
      </section>

      {/* Detalle de usuario Modal */}
      <div className="modal fade" id="detalleUsuarioModal" tabIndex="-1" aria-labelledby="detalleUsuarioModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="detalleUsuarioModalLabel"> Detalles del Usuario </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {usuarioSeleccionado && (
                <>
                  <p>
                    <strong>Nombre de Usuario:</strong> {usuarioSeleccionado.nombreusuario}
                  </p>
                  <p>
                    <strong>Rol:</strong> {usuarioSeleccionado.rol}
                  </p>
                  <p>
                    <strong>Estado:</strong> {usuarioSeleccionado.activo}
                  </p>
                  <div className="mt-3">
                  <button
                    className={`btn ${usuarioSeleccionado.activo === 'Activo' ? 'btn-warning' : 'btn-success w-75'} me-2 `}
                    type="button"
                    onClick={() => toggleEstadoUsuario(usuarioSeleccionado.userid, usuarioSeleccionado.activo)}
                  >
                    {usuarioSeleccionado.activo === 'Activo' ? 'Desactivar' : 'Activar'}
                  </button>

                    <button className="btn btn-danger" type="button" onClick={() => eliminarUsuario(usuarioSeleccionado.userid)}> Eliminar </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registro de Usuario Modal */}
      <div className="modal fade" id="usuariosModal" tabIndex="-1" aria-labelledby="usuariosModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="usuariosModalLabel"> Registro de Usuario  </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
              <div className="form-group mb-3">
                  <label className='mb-1 mx-2'>Nombre de Usuario</label>
                  <input type="text" className="form-control" name="nombreusuario" placeholder="Ingrese su nombre de usuario" value={registro.nombreusuario} onChange={handleInputChange} required />
             </div>
                <div className="form-group mb-3">
                  <label className='mb-1 mx-2'>Contraseña</label>
                  <input
                    type="password" className="form-control" name="contrasenia" placeholder="Ingrese su contraseña"  value={registro.contrasenia} onChange={handleInputChange}  required />
                </div>
                <div className="form-group mb-3">
                  <label className='mb-1 mx-2'>Confirmar Contraseña</label>
                  <input type="password" className="form-control" name="confirmarContrasenia" placeholder="Confirme su contraseña" value={registro.confirmarContrasenia} onChange={handleInputChange} required />
                </div>
                <div className="form-group mb-3">
                  <label className='mb-1 mx-2'>Rol</label>
                  <select className="form-control" name="nombreRol" value={registro.nombreRol} onChange={handleInputChange} required >
                    <option value="" disabled selected> Seleccione un rol </option>
                    <option value="GODSYSTEM">GOODSYSTEM</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="EDITOR">EDITOR</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"> Cerrar </button>
              <button type="button" className="btn btn-primary" onClick={registrarUsuario}> Registrar Usuario </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};



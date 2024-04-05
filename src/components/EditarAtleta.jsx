import { useState, useEffect } from "react";
import axios from "axios";
const Swal = window.Swal;

const urlApi = import.meta.env.VITE_URL;

export const EditarAtleta = ({ atletaId, modal, close }) => {
    const [atleta, setAtleta] = useState({
        nombre: '',
        apellidos: '',
        fecha_nacimiento: '',
        grado_id: '',
        categoria_id: '',
        dni: '',
        escuela_id: '',
        maestro_id: ''
    });

    const obtenerAtleta = async () => {
        const url = `${urlApi}/api/atleta/${atletaId}`;
        const result= await axios.get(url, { withCredentials: true });
       setAtleta(result.data.atletas[0]) 
       console.log(result.data.atletas[0]);
        
    };

    useEffect(() => {
        obtenerAtleta();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAtleta(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const actualizarAtleta = async () => {
        const url = `${urlApi}/api/atleta/${atletaId}`;
        try {
            const response = await axios.put(url, atleta, { withCredentials: true });
            Swal.fire({
                title: '¡Atleta actualizado!',
                text: response.data.msg,
                icon: 'success'
            });
            close(); // Cierra la modal después de la actualización
        } catch (error) {
            console.error("Error al actualizar el atleta", error);
            Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el atleta',
                icon: 'error'
            });
        }
    };

    return (
        <>
            {modal ? (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Atleta</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={close}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <label>Nombre</label>
                                    <input type="text" name="nombre" value={atleta.nombre} onChange={handleChange} className="form-control" />
                                    {/* Repite este patrón para los demás campos del formulario */}
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={close}>Cerrar</button>
                                <button type="button" className="btn btn-primary" onClick={actualizarAtleta}>Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}

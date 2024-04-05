import './css/areaEditor.css';
import './css/maestros.css';

import { useEffect, useState } from 'react';
import axios from 'axios';

const Swal = window.Swal;

export const SubirPost = () => {

  const [postEdited, setPostEdited] = useState({});
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('');
  const [imagen, setImagen] = useState(null);
  const [edited, setEdited] = useState(false);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [consultarPosts, setConsultarPosts] = useState(true);

  const [postSelected, setPostSelected] = useState(null);

  async function getPosts() {
    try {
      const { data } = await axios(`${import.meta.env.VITE_URL}/api/posts`);
      // console.log(data);
      setPosts(data.posts);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setConsultarPosts(false);
    }
  }
  if (consultarPosts) {
    getPosts();
  }
  useEffect(() => {
    getPosts()
  }, [consultarPosts, edited]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!titulo || !descripcion || !tipo) {
      Swal.fire({
        title: 'Campos requeridos',
        text: 'Los campos titulo, descripcion, tipo son requeridos para agregar un post',
        icon: 'error'
      });
      return;
    }

    if (!edited) {
      if (!imagen) {
        Swal.fire({
          title: 'Agregue una imagen',
          text: 'Seleccione una imagen para el post',
          icon: 'error'
        });
        return;
      }
    }

    const postData = new FormData();
    postData.append('titulo', titulo);
    postData.append('descripcion', descripcion);
    postData.append('image', imagen);
    postData.append('tipo', tipo);

    try {
      const url = edited ? `${import.meta.env.VITE_URL}/api/posts/${postEdited.postid}` : `${import.meta.env.VITE_URL}/api/posts`;
      setSending(true);
      if (edited) {
        const { data } = await axios.put(url, { titulo, descripcion, tipo }, { withCredentials: true });
        console.log(data);
      } else {
        await axios.post(url, postData, { withCredentials: true });
      }
      setTitulo('');
      setImagen(null);
      setDescripcion('');
      setTipo('');
      Swal.fire({
        title: edited ? 'Post editado correctamente' : 'Post creado correctamente',
        icon: 'success'
      }).then((result) => {
        if (result.isConfirmed) {
        getPosts()
        setEdited(false)
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
      setConsultarPosts(true);
    }
  }

  async function updataPost(post) {
    setPostEdited(post);
    const modal = new window.bootstrap.Modal(document.querySelector('#registroPost'));
    modal.show();
    setEdited(true);
    setTitulo(post.titulo);
    setDescripcion(post.descripcion);
    setTipo(post.tipo);
  }

  async function handleEliminarPost(id) {
    window.Swal.fire({
      title: '¿Esta seguro de eliminar este post?',
      confirmButtonText: "Eliminar",
      denyButtonText: `No eliminar`
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url = `${import.meta.env.VITE_URL}/api/posts/${id}`;
          await axios.delete(url, { withCredentials: true });
          setConsultarPosts(true);
          Swal.fire({
            title: 'Post eliminado correctamente',
            icon: 'success'
          }).then((result) => {
            if (result.isConfirmed) {
            getPosts()
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  const limpiarFormulario = () =>{
    setDescripcion(false)
    setTitulo("");
    setDescripcion("");
    setTipo("");
    setEdited(false);
  }
  
  return (
    <>
      <section className='w-100 h-100 d-flex flex-column align-items-center'>
        <div className='d-flex w-75 mt-5 justify-content-between'>
          <h2 className='text-center fw-bold'>Publicaciones</h2>
          <div>
            <button className='btn btn-success' type="btn" data-bs-toggle="modal" data-bs-target="#registroPost" >Registrar Un Post</button>
          </div>
        </div>

        {/* Mostrar tabla en dispositivos moviles */}
        <div id='lista-maestros'>
          <div className="d-md-none">
            <ul className="list-group">
              {posts.slice(0).reverse().map((p) => (
                <li key={p.postid} className="list-group-item">
                  <div className="d-flex justify-content-between">
                    <p>{p.titulo}</p>
                    <div>
                      <button className="btn" onClick={() => setPostSelected(p)} data-bs-toggle="modal" data-bs-target="#postModal2">
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
        {/* Detalle de usuario Modal */}
        <div className="modal fade" id="postModal2" tabIndex="-1" aria-labelledby="detalleUsuarioModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="detalleUsuarioModalLabel">Información sobre el posts</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {postSelected && (
                  <>
                    <img
                      className='w-50 mx-auto mb-3 d-block'
                      src={`data:${postSelected.extension_archivo};base64,${postSelected.archivo}`}
                    />
                    <p>
                      <strong>Titulo:</strong> {postSelected.titulo}
                    </p>
                    <p>
                      <strong>Tipo:</strong> {postSelected.tipo}
                    </p>
                    <div className="mt-3">
                      <button onClick={() => updataPost(postSelected)} className='btn btn-warning w-100 mb-2'>
                        Editar
                      </button>
                      <button tabIndex={10} onClick={() => handleEliminarPost(postSelected.postid)} className='btn btn-danger w-100'>
                        Eliminar
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {loading ? <p className='text-center my-3'>Obteniendo Posts</p> : (
          <table className="table overflow-y-auto border TblShadw d-none d-md-block table-hover tablita w-75">
            <thead className='encabezadoTabla'>
              <tr>
                <th scope="col">Titulo</th>
                <th scope="col">Tipo</th>
                <th scope="col">Imagen</th>
                <th scope="col">Descripción</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.slice(0).reverse().map(post => (
                <tr key={post.postid} className='post'>
                  <td>{post.titulo}</td>
                  <td>{post.tipo}</td>
                  <td>
                    <img
                      className='w-100'
                      src={`data:${post.extension_archivo};base64,${post.archivo}`}
                    />
                  </td>
                  <td className='descripcion'>{post.descripcion}</td>
                  <td className=''>
                    <button onClick={() => updataPost(post)} className='btn btn-warning w-100 mb-2'>
                      Editar
                    </button>
                    <button tabIndex={10} onClick={() => handleEliminarPost(post.postid)} className='btn btn-danger w-100'>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div className="modal fade" id="registroPost" tabIndex="-1" data-bs-target="#postModal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center">
                {edited ? 'Editando post' : 'Registrar un Post'}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={limpiarFormulario}></button>
            </div>
            <div className="modal-body">
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="titulo" className="form-label fw-bold">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      id="titulo"
                      name="titulo"
                      value={titulo}
                      onChange={e => setTitulo(e.target.value)}
                    />
                  </div>

                  {!edited && (
                    <div className="mb-3">
                      <label htmlFor="banner" className="form-label fw-bold">Banner</label>
                      <input
                        type="file"
                        className="form-control h-100 w-100"
                        id="banner"
                        name="banner"
                        accept="image/*"
                        onChange={e => {
                          if (e.target.files) {
                            setImagen(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="tipo" className="form-label fw-bold">Tipo de Post</label>
                    <select
                      className='form-control'
                      id='tipo'
                      value={tipo}
                      onChange={e => setTipo(e.target.value)}
                    >
                      <option value=''>-- Seleccione --</option>
                      <option value='noticias'>Noticias</option>
                      <option value='participaciones'>Ultimas Participaciones</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label fw-bold">Descripción</label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      name="descripcion"
                      rows="5"
                      value={descripcion}
                      onChange={e => setDescripcion(e.target.value)}
                    ></textarea>
                  </div>
                  <div className='w-100 d-flex justify-content-center'>
                    <button
                      type='submit'
                      className='btn btn-success'
                      disabled={sending}
                      data-bs-dismiss="modal" aria-label="Close"
                      
                    >
                      {sending ? 'Guardando...' : 'Guardar'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={limpiarFormulario}>Cerrar</button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import './css/PostList.css';

function PostsList({ tipo }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function getPosts() {
      setLoading(true);
      try {
        const { data } = await axios(`${import.meta.env.VITE_URL}/api/posts?tipo=${tipo}`);
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getPosts();
  }, [tipo]);

  useEffect(() => {
    document.body.style.overflow = modalVisible ? 'hidden' : 'unset';
  }, [modalVisible]);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedPost(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      {posts.slice(0).reverse().map((post, i) => (
        <div key={i} className="col-12 col-lg-3 col-md-4 col-sm-6 mb-3">
          <div className="card custom-card" style={{ height: '100%' }} onClick={() => handleCardClick(post)}>
            <img src={`data:${post.extension};base64,${post.archivo}`} className="card-img-top" alt="..." />
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h6 className="card-title font-weight-bold text-center">{post.titulo}</h6>
              <p className="card-text small text-center">{post.descripcion.substring(0, 17)}...</p>
              <button className="btn btn-post">Seguir leyendo</button>
            </div>
          </div>
        </div>
      ))}

      {modalVisible && selectedPost && (
        <div className="modal-backdrop" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal display-block" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-black text-center w-100">{selectedPost.titulo}</h5>
                  <button type="button" className="btn-close" onClick={closeModal}></button>
                </div>
                <div className="modal-body">
                  <img src={`data:${selectedPost.extension};base64,${selectedPost.archivo}`} alt="Post" className="w-100 rounded-2 mb-3" />
                  <p className="card-text text-black">{selectedPost.descripcion}</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostsList;
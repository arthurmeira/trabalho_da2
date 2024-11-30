import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Importando axios para fazer requisições HTTP
import './css/UserPage.css';

function UserPage() {
  const [usuarios, setUsuarios] = useState([]); // Estado para armazenar os usuários
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user: '',
    pwd: '',
    level: '',
    status: '',
  });
  const [editMode, setEditMode] = useState(false);  // Determina se estamos em modo de edição
  const [currentUserId, setCurrentUserId] = useState(null);  // Armazena o ID do usuário atual
  const [error, setError] = useState('');  // Armazena mensagens de erro

  // Carregar usuários ao montar o componente
  useEffect(() => {
    axios.get('http://localhost:5000/users')  // Alterei para usar axios para pegar os usuários
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        setError('Erro ao carregar usuários');
      });
  }, []);  // O array vazio garante que o efeito seja executado uma vez na montagem do componente

  // Função para lidar com mudanças no formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para cadastrar ou editar um usuário
  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editMode ? `http://localhost:5000/users/${currentUserId}` : 'http://localhost:5000/users';
    const method = editMode ? 'PUT' : 'POST';

    axios({
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
      },
      data: formData,
    })
      .then((response) => {
        if (editMode) {
          setUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
              user._id === currentUserId ? response.data : user
            )
          );
        } else {
          setUsuarios((prevUsuarios) => [...prevUsuarios, response.data]);
        }
        setFormData({ name: '', email: '', user: '', pwd: '', level: '', status: '' });
        setEditMode(false);
        setCurrentUserId(null);
        setError('');
      })
      .catch(() => setError('Erro ao salvar usuário.'));
  };

  // Função para excluir um usuário
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      axios.delete(`http://localhost:5000/users/${id}`)
        .then(() => {
          setUsuarios(usuarios.filter((user) => user._id !== id));  // Alterando para usar _id
        })
        .catch(() => setError('Erro ao excluir usuário.'));
    }
  };

  // Função para editar um usuário
  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      user: user.user,
      pwd: user.pwd,
      level: user.level,
      status: user.status,
    });
    setCurrentUserId(user._id);  // Alterando para usar _id
    setEditMode(true);
  };

  return (
    <div className="user-page-container">
      <h1>Gestão de Usuários</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="user-form">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="user"
          placeholder="Nome de Usuário"
          value={formData.user}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="pwd"
          placeholder="Senha"
          value={formData.pwd}
          onChange={handleInputChange}
          required
        />
        <select
          name="level"
          value={formData.level}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione o Nível</option>
          <option value="1">Administrador</option>
          <option value="2">Usuário</option>
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          required
        >
          <option value="">Selecione o Status</option>
          <option value="on">Ativo</option>
          <option value="off">Inativo</option>
        </select>
        <button type="submit" className="submit-btn">
          {editMode ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <h2>Usuários Cadastrados</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Nome de Usuário</th>
            <th>Nível</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((user) => (
            <tr key={user._id}>  {/* Alterado para usar _id */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.user}</td>
              <td>{user.level}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Excluir</button> {/* Alterado para usar _id */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserPage;

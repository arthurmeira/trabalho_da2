import React, { useState, useEffect } from 'react';
import './css/UserPage.css';

function UserPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user: '',
    pwd: '',
    level: '',
    status: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [error, setError] = useState('');

  // Carregar usuários ao montar o componente
  useEffect(() => {
    fetch('/users')
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((error) => setError('Erro ao carregar usuários'));
  }, []);

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

    const url = editMode ? `/users/${currentUserId}` : '/users';
    const method = editMode ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editMode) {
          setUsuarios((prevUsuarios) =>
            prevUsuarios.map((user) =>
              user._id === currentUserId ? data : user
            )
          );
        } else {
          setUsuarios((prevUsuarios) => [...prevUsuarios, data]);
        }
        setFormData({ name: '', email: '', user: '', pwd: '', level: '', status: '' });
        setEditMode(false);
        setCurrentUserId(null);
        setError('');
      })
      .catch((error) => setError('Erro ao salvar usuário.'));
  };

  // Função para excluir um usuário
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      fetch(`/users/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setUsuarios(usuarios.filter((user) => user._id !== id));
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
    setCurrentUserId(user._id);
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
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.user}</td>
              <td>{user.level}</td>
              <td>{user.status}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Editar</button>
                <button onClick={() => handleDelete(user._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserPage;

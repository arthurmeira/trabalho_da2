import React, { useState, useEffect } from 'react';
import './css/TeacherPage.css';

function TeacherPage() {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    school_disciplines: '',
    contact: '',
    phone_number: '',
    status: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentTeacherId, setCurrentTeacherId] = useState(null);
  const [error, setError] = useState('');

  // Carregar professores ao montar o componente
  useEffect(() => {
    fetch('/teachers')
      .then((response) => response.json())
      .then((data) => setTeachers(data))
      .catch((error) => setError('Erro ao carregar professores'));
  }, []);

  // Função para lidar com mudanças no formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para cadastrar ou editar um professor
  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editMode ? `/teachers/${currentTeacherId}` : '/teachers';
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
          setTeachers((prevTeachers) =>
            prevTeachers.map((teacher) =>
              teacher._id === currentTeacherId ? data : teacher
            )
          );
        } else {
          setTeachers((prevTeachers) => [...prevTeachers, data]);
        }
        setFormData({ name: '', school_disciplines: '', contact: '', phone_number: '', status: '' });
        setEditMode(false);
        setCurrentTeacherId(null);
        setError('');
      })
      .catch((error) => setError('Erro ao salvar professor.'));
  };

  // Função para excluir um professor
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este professor?')) {
      fetch(`/teachers/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setTeachers(teachers.filter((teacher) => teacher._id !== id));
        })
        .catch(() => setError('Erro ao excluir professor.'));
    }
  };

  // Função para editar um professor
  const handleEdit = (teacher) => {
    setFormData({
      name: teacher.name,
      school_disciplines: teacher.school_disciplines,
      contact: teacher.contact,
      phone_number: teacher.phone_number,
      status: teacher.status,
    });
    setCurrentTeacherId(teacher._id);
    setEditMode(true);
  };

  return (
    <div className="teacher-page-container">
      <h1>Gestão de Professores</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="teacher-form">
        <input
          type="text"
          name="name"
          placeholder="Nome"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="school_disciplines"
          placeholder="Disciplinas"
          value={formData.school_disciplines}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="contact"
          placeholder="E-mail"
          value={formData.contact}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="phone_number"
          placeholder="Telefone"
          value={formData.phone_number}
          onChange={handleInputChange}
          required
        />
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

      <h2>Professores Cadastrados</h2>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Disciplinas</th>
            <th>E-mail</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td>{teacher.name}</td>
              <td>{teacher.school_disciplines}</td>
              <td>{teacher.contact}</td>
              <td>{teacher.phone_number}</td>
              <td>{teacher.status}</td>
              <td>
                <button onClick={() => handleEdit(teacher)}>Editar</button>
                <button onClick={() => handleDelete(teacher._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherPage;

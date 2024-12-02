// frontend/src/components/AppointmentPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AppointmentPage.css';

function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);  // Estado para armazenar compromissos
  const [formData, setFormData] = useState({
    specialty: '',
    comments: '',
    date: '',
    student: '',
    professional: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);
  const [error, setError] = useState('');
  const [filterId, setFilterId] = useState('');  // Estado para armazenar o ID a ser filtrado

  // Carregar compromissos ao montar o componente
  useEffect(() => {
    axios.get('http://localhost:5000/appointments')  // URL completa do backend
      .then((response) => {
        console.log("Compromissos carregados:", response.data);  // Verifica os dados no console
        setAppointments(response.data);
      })
      .catch((error) => {
        console.error("Erro ao carregar compromissos:", error);  // Log do erro
        setError('Erro ao carregar compromissos');
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

  // Função para cadastrar ou editar um compromisso
  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editMode ? `http://localhost:5000/appointments/${currentAppointmentId}` : 'http://localhost:5000/appointments';
    const method = editMode ? 'put' : 'post';

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
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.id === currentAppointmentId ? response.data : appointment
            )
          );
        } else {
          setAppointments((prevAppointments) => [...prevAppointments, response.data]);
        }
        setFormData({ specialty: '', comments: '', date: '', student: '', professional: '' });
        setEditMode(false);
        setCurrentAppointmentId(null);
        setError('');
      })
      .catch(() => setError('Erro ao salvar compromisso.'));
  };

  // Função para excluir um compromisso
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este compromisso?')) {
      axios.delete(`http://localhost:5000/appointments/${id}`)
        .then(() => {
          setAppointments(appointments.filter((appointment) => appointment.id !== id));
        })
        .catch(() => setError('Erro ao excluir compromisso.'));
    }
  };

  // Função para editar um compromisso
  const handleEdit = (appointment) => {
    setFormData({
      specialty: appointment.specialty,
      comments: appointment.comments,
      date: appointment.date,
      student: appointment.student,
      professional: appointment.professional,
    });
    setCurrentAppointmentId(appointment.id);
    setEditMode(true);
  };

  // Função para filtrar os compromissos pelo ID
  const filteredAppointments = appointments.filter((appointment) =>
    appointment.id.toLowerCase().includes(filterId.toLowerCase())  // Filtro baseado no ID
  );

  return (
    <div className="appointment-page-container">
      <h1>Gestão de Compromissos</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="appointment-form">
        <input
          type="text"
          name="specialty"
          placeholder="Especialidade"
          value={formData.specialty}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="comments"
          placeholder="Comentários"
          value={formData.comments}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="student"
          placeholder="Nome do Estudante"
          value={formData.student}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="professional"
          placeholder="Nome do Profissional"
          value={formData.professional}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="submit-btn">
          {editMode ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <h2>Compromissos Cadastrados</h2>
      
      {/* Campo para filtrar compromissos pelo ID */}
      <input
        type="text"
        placeholder="Pesquisa por ID"
        value={filterId}
        onChange={(e) => setFilterId(e.target.value)}
        className="filter-input"
      />

      <table className="appointment-table">
        <thead>
          <tr>
            <th>Especialidade</th>
            <th>Comentários</th>
            <th>Data</th>
            <th>Estudante</th>
            <th>Profissional</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.specialty}</td>
              <td>{appointment.comments}</td>
              <td>{new Date(appointment.date).toLocaleString()}</td>
              <td>{appointment.student}</td>
              <td>{appointment.professional}</td>
              <td>
                <button onClick={() => handleEdit(appointment)}>Editar</button>
                <button onClick={() => handleDelete(appointment.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppointmentPage;

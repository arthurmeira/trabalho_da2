import React, { useState, useEffect } from 'react';
import './css/AppointmentPage.css';

function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
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

  // Carregar compromissos ao montar o componente
  useEffect(() => {
    fetch('/appointments')
      .then((response) => response.json())
      .then((data) => setAppointments(data))
      .catch((error) => setError('Erro ao carregar compromissos'));
  }, []);

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

    const url = editMode ? `/appointments/${currentAppointmentId}` : '/appointments';
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
          setAppointments((prevAppointments) =>
            prevAppointments.map((appointment) =>
              appointment.id === currentAppointmentId ? data : appointment
            )
          );
        } else {
          setAppointments((prevAppointments) => [...prevAppointments, data]);
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
      fetch(`/appointments/${id}`, {
        method: 'DELETE',
      })
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
          {appointments.map((appointment) => (
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

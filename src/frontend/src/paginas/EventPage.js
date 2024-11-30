import React, { useState, useEffect } from 'react';
import './css/EventPage.css'; // Adicione o CSS da página

function EventPage() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    comments: '',
    date: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [error, setError] = useState('');

  // Carregar eventos ao montar o componente
  useEffect(() => {
    fetch('http://localhost:5000/events')  // URL ajustada para o backend correto
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch(() => setError('Erro ao carregar eventos'));
  }, []);

  // Função para lidar com mudanças no formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para cadastrar ou editar um evento
  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editMode ? `http://localhost:5000/events/${currentEventId}` : 'http://localhost:5000/events';
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
          setEvents((prevEvents) =>
            prevEvents.map((ev) => (ev._id === currentEventId ? data : ev))
          );
        } else {
          setEvents((prevEvents) => [...prevEvents, data]);
        }
        setFormData({ description: '', comments: '', date: '' });
        setEditMode(false);
        setCurrentEventId(null);
        setError('');
      })
      .catch(() => setError('Erro ao salvar evento.'));
  };

  // Função para excluir um evento
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      fetch(`http://localhost:5000/events/${id}`, {  // URL ajustada para o backend correto
        method: 'DELETE',
      })
        .then(() => {
          setEvents(events.filter((event) => event._id !== id));
        })
        .catch(() => setError('Erro ao excluir evento.'));
    }
  };

  // Função para editar um evento
  const handleEdit = (event) => {
    setFormData({
      description: event.description,
      comments: event.comments,
      date: event.date,
    });
    setCurrentEventId(event._id);
    setEditMode(true);
  };

  return (
    <div className="event-page-container">
      <h1>Gestão de Eventos</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="event-form">
        <input
          type="text"
          name="description"
          placeholder="Descrição"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
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
        <button type="submit" className="submit-btn">
          {editMode ? 'Atualizar' : 'Cadastrar'}
        </button>
      </form>

      <h2>Eventos Cadastrados</h2>
      <table className="event-table">
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Comentários</th>
            <th>Data</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td>{event.description}</td>
              <td>{event.comments}</td>
              <td>{new Date(event.date).toLocaleString()}</td>
              <td>
                <button onClick={() => handleEdit(event)}>Editar</button>
                <button onClick={() => handleDelete(event._id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventPage;

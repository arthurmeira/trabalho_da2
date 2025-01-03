import React, { useState, useEffect } from 'react';
import './css/ProfessionalPage.css'; // Importar o CSS

function ProfessionalPage() {
  const [professionals, setProfessionals] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    contact: '',
    phone_number: '',
    status: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentProfessionalId, setCurrentProfessionalId] = useState(null);
  const [error, setError] = useState('');
  const [filterId, setFilterId] = useState('');  // Estado para armazenar o ID a ser filtrado

  // Carregar profissionais ao montar o componente
  useEffect(() => {
    fetch('http://localhost:5000/professionals') // URL ajustada
      .then((response) => response.json())
      .then((data) => setProfessionals(data))
      .catch(() => setError('Erro ao carregar profissionais'));
  }, []);

  // Função para lidar com mudanças no formulário
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função para cadastrar ou editar um profissional
  const handleSubmit = (event) => {
    event.preventDefault();

    const url = editMode ? `http://localhost:5000/professionals/${currentProfessionalId}` : 'http://localhost:5000/professionals';
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
          setProfessionals((prevProfessionals) =>
            prevProfessionals.map((professional) =>
              professional.id === currentProfessionalId ? data : professional
            )
          );
        } else {
          setProfessionals((prevProfessionals) => [...prevProfessionals, data]);
        }
        setFormData({
          name: '',
          specialty: '',
          contact: '',
          phone_number: '',
          status: '',
        });
        setEditMode(false);
        setCurrentProfessionalId(null);
        setError('');
      })
      .catch(() => setError('Erro ao salvar profissional.'));
  };

  // Função para excluir um profissional
  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este profissional?')) {
      fetch(`http://localhost:5000/professionals/${id}`, {  // URL ajustada
        method: 'DELETE',
      })
        .then(() => {
          setProfessionals(professionals.filter((professional) => professional.id !== id));
        })
        .catch(() => setError('Erro ao excluir profissional.'));
    }
  };

  // Função para editar um profissional
  const handleEdit = (professional) => {
    setFormData({
      name: professional.name,
      specialty: professional.specialty,
      contact: professional.contact,
      phone_number: professional.phone_number,
      status: professional.status,
    });
    setCurrentProfessionalId(professional.id);
    setEditMode(true);
  };

  // Função para filtrar os profissionais pelo ID
  const filteredProfessionals = professionals.filter((professional) =>
    professional.id.toString().toLowerCase().includes(filterId.toLowerCase())  // Filtro baseado no ID
  );

  return (
    <div className="professional-page-container">
      <h1>Gestão de Profissionais</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="professional-form">
        {/* ID removido, caso seja gerado pelo backend */}
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
          name="specialty"
          placeholder="Especialidade"
          value={formData.specialty}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contato"
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

      <h2>Profissionais Cadastrados</h2>
      
      {/* Campo para filtrar profissionais pelo ID */}
      <input
        type="text"
        placeholder="Pesquisa por ID"
        value={filterId}
        onChange={(e) => setFilterId(e.target.value)}
        className="filter-input"
      />

      <table className="professional-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Especialidade</th>
            <th>Contato</th>
            <th>Telefone</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessionals.map((professional) => (
            <tr key={professional.id}>
              <td>{professional.id}</td>
              <td>{professional.name}</td>
              <td>{professional.specialty}</td>
              <td>{professional.contact}</td>
              <td>{professional.phone_number}</td>
              <td>{professional.status}</td>
              <td>
                <button onClick={() => handleEdit(professional)}>Editar</button>
                <button onClick={() => handleDelete(professional.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProfessionalPage;

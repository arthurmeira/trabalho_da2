import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css'; // Estilos para o Dashboard

function Dashboard() {
  const navigate = useNavigate(); // Atualizado de useHistory para useNavigate

  const handleNavigation = (path) => {
    navigate(path); // Redireciona para a página correspondente
  };

  return (
    <div className="dashboard-container">
      <h1>Bem-vindo ao Sistema de Cadastro</h1>
      <p>Escolha um tipo de cadastro para continuar</p>
      
      <div className="buttons-container">
        <button onClick={() => handleNavigation('/userpage')} className="btn">
          Cadastro de Usuário
        </button>
        <button onClick={() => handleNavigation('/techerpage')} className="btn">
          Cadastro de Professor
        </button>
        <button onClick={() => handleNavigation('/StudentPage')} className="btn">
          Cadastro de Estudante
        </button>
        <button onClick={() => handleNavigation('/ProfessionalPage')} className="btn">
          Cadastro de Profissional
        </button>
        <button onClick={() => handleNavigation('/EventPage')} className="btn">
          Cadastro de Evento
        </button>
        <button onClick={() => handleNavigation('/AppointmentPage')} className="btn">
          Cadastro de Compromisso
        </button>
      </div>
    </div>
  );
}

export default Dashboard;

  import React from 'react';
  import { useNavigate } from 'react-router-dom';
  import './css/Dashboard.css';

  function Dashboard2() {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
      navigate(path);
    };

    return (
      <div className="dashboard-container">
        <h1>Bem-vindo ao Sistema de Cadastro</h1>
        <p>Escolha uma opção para continuar</p>
        
        <div className="buttons-container">
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

  export default Dashboard2;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importando o useNavigate
import '../login.css'; // Arquivo CSS para estilos

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [logado, setLogado] = useState(false);
  const navigate = useNavigate(); // Inicializando o useNavigate

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação de login
    if (email === 'ad@g.com' && senha === '123') {
      setLogado(true);
      setErro('');
      navigate('/dashboard'); // Redireciona para a página de Dashboard
    } else {
      setErro('Usuário ou senha inválidos.');
      setLogado(false);
    }
  };

  if (logado) {
    return (
      <div className="login-container">
        <h1>Bem-vindo, {email}!</h1>
        <p>Você está logado.</p>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        {erro && <p className="error">{erro}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>
          <div className="input-group">
            <label>Senha:</label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          <button type="submit" className="btn">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

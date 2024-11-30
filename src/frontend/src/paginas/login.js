import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (email === 'joao@gmail.com' && senha === '123') {
      localStorage.setItem('userLevel', '1');
      setErro('');
      navigate('/dashboard');
    }
    else if (email === 'lucas@gmail.com' && senha === '123') {
      localStorage.setItem('userLevel', '2');
      setErro('');
      navigate('/dashboard2');
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  };

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
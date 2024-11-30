import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nivel, setNivel] = useState(''); // Adicionando o estado para o nível
  const [erro, setErro] = useState('');
  const [logado, setLogado] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validação de login
    if (email === 'ad@g.com' && senha === '123' && nivel === '1') {
      setLogado(true);
      setErro('');
      navigate('/dashboard'); // Redireciona para o Dashboard de administrador
    } else if (email === 'user@g.com' && senha === '123' && nivel === '2') {
      setLogado(true);
      setErro('');
      navigate('/userpage'); // Redireciona para a página do usuário
    } else {
      setErro('Usuário, senha ou nível inválidos.');
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
          <div className="input-group">
            <label>Nível:</label>
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value)}
              required
            >
              <option value="">Selecione o nível</option>
              <option value="1">Administrador</option>
              <option value="2">Usuário</option>
            </select>
          </div>
          <button type="submit" className="btn">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;

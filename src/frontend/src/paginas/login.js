import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importando o axios para a requisição HTTP
import './css/login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Preparando os dados para enviar no login
      const data = { email, senha };

      // Enviando a requisição POST para o backend usando axios
      const response = await axios.post('http://localhost:5000/users/login', data);

      if (response.status === 200) {
        // Salvando o nível de acesso no localStorage
        localStorage.setItem('userLevel', response.data.level);
        setErro(''); // Limpa qualquer erro anterior

        // Redirecionando para a tela de acordo com o nível de acesso do usuário
        if (response.data.level === '1') {
          navigate('/dashboard');
        } else if (response.data.level === '2') {
          navigate('/dashboard2');
        }
      } else {
        setErro(response.data.message || 'Usuário ou senha inválidos.');
      }
    } catch (error) {
      // Tratamento de erros
      if (error.response) {
        // Caso haja uma resposta de erro do servidor
        setErro(error.response.data.message || 'Erro ao fazer login.');
      } else if (error.request) {
        // Caso não haja resposta do servidor
        setErro('Erro ao conectar ao servidor.');
      } else {
        // Outros erros desconhecidos
        setErro('Erro desconhecido: ' + error.message);
      }
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

import React, { useState, useEffect } from 'react';

function UserPage() {
  const [userLevel, setUserLevel] = useState(null);

  useEffect(() => {
    // Recupera o nível do usuário do localStorage
    const level = localStorage.getItem('userLevel');
    setUserLevel(level);
  }, []);

  return (
    <div>
      <h1>Bem-vindo à página de Cadastro de Usuário</h1>
      <p>Conteúdo permitido para o nível do usuário atual: {userLevel}</p>
    </div>
  );
}

export default UserPage;
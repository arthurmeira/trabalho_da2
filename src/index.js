const cors = require('cors');
const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const mongoose = require('mongoose');
const appointmentsRoutes = require('./routes/appointmentsRoutes');  // Importando as rotas de compromissos
const usersRoutes = require('./routes/usersRoutes');  // Importando as rotas de usuarios
const eventsRoutes = require('./routes/eventsRoutes');  // Importando as rotas de eventos
const professionalsRoutes = require('./routes/professionalsRoutes');  // Importando as rotas de profissionais
const studentsRoutes = require('./routes/studentsRoutes');  // Importando as rotas de estudantes
const teachersRoutes = require('./routes/teachersRoutes');  // Importando as rotas de professores



const app = express();

// Configuração do CORS para permitir requisições do frontend React
app.use(cors({
  origin: 'http://localhost:3000'  // Permite requisições apenas do frontend React
}));

app.use(express.json());  // Permite o envio de JSON no corpo das requisições

// Configuração do MongoDB
mongoose.connect('mongodb://localhost:27017/Chain_db', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Conectado ao MongoDB!'))
  .catch((error) => console.error('Erro ao conectar no MongoDB:', error));

// Configuração do Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API CHAIN",
      version: "1.0.0",
      description: "API CHAIN - GESTÃO ENSINO ESPECIAL"
    },
    servers: [{ url: "http://localhost:5000/" }]  // Mudando para a porta 5000
  },
  apis: [__dirname + "/routes/*.js"], // Mantém rotas documentadas
};

const specs = swaggerJsDoc(options);
app.use("/chain", swaggerUI.serve, swaggerUI.setup(specs));  // Configuração do Swagger para documentação

// Rota de compromissos
app.use('/appointments', appointmentsRoutes);  // Definindo a rota para compromissos
app.use('/users', usersRoutes);  // Definindo a rota para usuarios
app.use('/events', eventsRoutes);  // Definindo a rota para eventos
app.use('/professionals', professionalsRoutes);  // Definindo a rota para profissionais
app.use('/students', studentsRoutes);  // Definindo a rota para estudantes
app.use('/teachers', teachersRoutes);  // Definindo a rota para professores




// Inicia o servidor na porta 5000 (alterado para 5000, como combinado)
app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000!');
});

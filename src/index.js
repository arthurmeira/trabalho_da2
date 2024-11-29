const express = require('express');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const cors = require('cors');
const mongoose = require('mongoose'); // Adicionado
const routes = require('./routes');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do MongoDB
mongoose.connect('mongodb://localhost:27017')
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
    servers: [{ url: "http://localhost:8080/" }]
  },
  apis: [__dirname + "/routes/*.js"], // Mantém rotas documentadas
};

const specs = swaggerJsDoc(options);
app.use("/chain", swaggerUI.serve, swaggerUI.setup(specs));

// Rotas
app.use('/', routes);

app.listen(8080, () => console.log('Aplicação rodando na porta 8080!'));

const express = require('express');
const swaggerUI = require ('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();
const routes = require('./routes');
const cors = require('cors');
app.use(cors());

app.use(express.json());

//swagger
const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API CHAIN",
        version: "1.0.0",
        description: "API CHAIN - GESTAO ENSINO ESPECIAL"
      },
      license: {
        name: 'Licenciado para DAII'
      },
      contact: {
        name: 'Arthur Meira'
      },
      servers: [
        {
          url: "http://localhost:8080/",
          description: 'Server'
        }
      ]
    },
    //apis: ["./src/routes/*.js"]
    apis: [__dirname + "/routes/*.js"],
  };

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(function(req, res, next){ //
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
 }); //

app.use('/', routes)

app.listen(8080, function () { 
  console.log('Aplicação executando na porta 8080!'); }); 
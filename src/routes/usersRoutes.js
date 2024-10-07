const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let usersDB = require('../db/users.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente no cadastro do Usuário
 *         name:
 *           type: string
 *           description: Nome do Usuário
 *         email:
 *           type: string
 *           description: E-mail do Usuário
 *         user:
 *           type: string
 *           description: Nome de usuário do Usuário
 *         pwd:
 *           type: string
 *           description: Senha do Usuário
 *         level:
 *           type: string
 *           description: Nível de acesso do Usuário
 *         status:
 *           type: string
 *           description: Se o Usuário está ativo
 *       example:
 *         name: Nome aqui...
 *         email: Email aqui...
 *         user: Usuário aqui...
 *         pwd: Senha aqui...
 *         level: Nívdel aqui (1 - admin / 2 - padrao)...
 *         status: Status aqui (on / off)...
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: >
 *       Arthur Meira 
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */
router.get('/', (req, res) => {
    console.log("getroute");
    res.json(usersDB);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retorna um usuário pelo ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Usuário
 *     responses:
 *       200:
 *         description: Retorna os dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const user = usersDB.find(user => user.id === id);
    if (!user) return res.status(404).json({ "erro": "Usuário não encontrado" });
    res.json(user);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       201:
 *         description: O Usuário foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 */
router.post('/', (req, res) => {
    const user = { ...req.body, id: uuidv4() };
    console.log(user)
    console.log(req.body); // Veja se o corpo está correto
    // Validações
    if (!user.name) return res.status(400).json({ "erro": "O Usuário precisa ter um nome" });
    if (!user.email) return res.status(400).json({ "erro": "O Usuário precisa ter um e-mail" });
    if (!user.user) return res.status(400).json({ "erro": "O Usuário precisa ter um nome de usuário" });
    if (!user.pwd) return res.status(400).json({ "erro": "O Usuário precisa ter uma senha" });
    if (!user.level) return res.status(400).json({ "erro": "O Usuário precisa ter um nível de acesso" });
    if (!user.status) return res.status(400).json({ "erro": "O Usuário precisa ter um status" });

    usersDB.push(user);
    fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(usersDB, null, 2), 'utf8');
    
    return res.status(201).json(user); // Retorna 201 Created
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um Usuário pela ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: O Usuário foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const atualUserIndex = usersDB.findIndex(atualUser => atualUser.id === id);

    if (atualUserIndex === -1) {
        return res.status(404).json({ "erro": "Usuário não encontrado" });
    }

    const newUser = { ...req.body, id: usersDB[atualUserIndex].id };

    // Validações
    if (!newUser.name || !newUser.email || !newUser.user || !newUser.pwd || !newUser.level || !newUser.status) {
        return res.status(400).json({ "erro": "Todos os campos devem ser preenchidos." });
    }

    usersDB[atualUserIndex] = newUser;
    fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(usersDB, null, 2), 'utf8');
    
    return res.json(newUser);
});


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta o Usuário através do ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Usuário
 *     responses:
 *       200:
 *         description: O Usuário foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const atualUserIndex = usersDB.findIndex(user => user.id === id);

    if (atualUserIndex === -1) return res.status(404).json({ "erro": "Usuário não encontrado" });

    const deletado = usersDB.splice(atualUserIndex, 1)[0];
    fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(usersDB, null, 2), 'utf8');

    return res.json(deletado);
});

module.exports = router;

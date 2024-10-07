const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let teachersDB = require('../db/teachers.json');
let usersDB = require('../db/users.json'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Teacher:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - school_disciplines
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID deve ser associado a um usuário existente
 *         name:
 *           type: string
 *           description: Nome do professor (preenchido automaticamente com base no usuário)
 *         school_disciplines:
 *           type: string
 *           description: Disciplinas que o professor leciona
 *         contact:
 *           type: string
 *           description: E-mail de contato do professor
 *         phone_number:
 *           type: string
 *           description: Número de telefone do professor
 *         status:
 *           type: string
 *           description: Status do professor (ativo/inativo)
 *       example:
 *         id: "id correspondente"
 *         name: ""
 *         school_disciplines: "diciplina do professor"
 *         contact: "gmail"
 *         phone_number: "xx xxxx xxxx"
 *         status: on/off
 */

/**
 * @swagger
 * tags:
 *   - name: Teachers
 *     description: Guilherme Ferreira
 */

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teacher'
 */
router.get('/', (req, res) => {
    res.json(teachersDB);
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: Retorna os dados do professor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const teacher = teachersDB.find(teacher => teacher.id === id);
    if (!teacher) return res.status(404).json({ "erro": "Professor não encontrado" });
    res.json(teacher);
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor (somente se tiver um usuário associado)
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       201:
 *         description: O professor foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       400:
 *         description: O ID do professor não está associado a nenhum usuário
 */
router.post('/', (req, res) => {
    const teacher = { ...req.body };

    
    const user = usersDB.find(user => user.id === teacher.id);
    if (!user) {
        return res.status(400).json({ "erro": "O ID do professor não está associado a nenhum usuário" });
    }

    
    teacher.name = user.name;

    
    if (!teacher.school_disciplines) return res.status(400).json({ "erro": "O professor precisa ter disciplinas associadas" });
    if (!teacher.contact) return res.status(400).json({ "erro": "O professor precisa ter um e-mail de contato" });
    if (!teacher.phone_number) return res.status(400).json({ "erro": "O professor precisa ter um número de telefone" });
    if (!teacher.status) return res.status(400).json({ "erro": "O professor precisa ter um status" });

    teachersDB.push(teacher);
    fs.writeFileSync(path.join(__dirname, '../db/teachers.json'), JSON.stringify(teachersDB, null, 2), 'utf8');
    
    return res.status(201).json(teacher); 
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza os dados de um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teacher'
 *     responses:
 *       200:
 *         description: O professor foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const atualTeacherIndex = teachersDB.findIndex(teacher => teacher.id === id);

    if (atualTeacherIndex === -1) {
        return res.status(404).json({ "erro": "Professor não encontrado" });
    }

    const newTeacher = { ...req.body, id: teachersDB[atualTeacherIndex].id };

    
    const user = usersDB.find(user => user.id === newTeacher.id);
    if (!user) {
        return res.status(400).json({ "erro": "O ID do professor não está associado a nenhum usuário" });
    }
    newTeacher.name = user.name;

    
    if (!newTeacher.school_disciplines || !newTeacher.contact || !newTeacher.phone_number || !newTeacher.status) {
        return res.status(400).json({ "erro": "Todos os campos devem ser preenchidos." });
    }

    teachersDB[atualTeacherIndex] = newTeacher;
    fs.writeFileSync(path.join(__dirname, '../db/teachers.json'), JSON.stringify(teachersDB, null, 2), 'utf8');
    
    return res.json(newTeacher);
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Deleta o professor através do ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do professor
 *     responses:
 *       200:
 *         description: O professor foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teacher'
 *       404:
 *         description: Professor não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const atualTeacherIndex = teachersDB.findIndex(teacher => teacher.id === id);

    if (atualTeacherIndex === -1) return res.status(404).json({ "erro": "Professor não encontrado" });

    const deletado = teachersDB.splice(atualTeacherIndex, 1)[0];
    fs.writeFileSync(path.join(__dirname, '../db/teachers.json'), JSON.stringify(teachersDB, null, 2), 'utf8');

    return res.json(deletado);
});

module.exports = router;
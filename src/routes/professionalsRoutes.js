const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let studentsDB = require('../db/students.json');
let usersDB = require('../db/users.json'); 

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - age
 *         - parents
 *         - phone_number
 *         - special_needs
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID deve ser associado a um usuário existente
 *         name:
 *           type: string
 *           description: Nome do estudante (preenchido automaticamente com base no usuário)
 *         age:
 *           type: string
 *           description: Idade do estudante
 *         parents:
 *           type: string
 *           description: Pais ou responsáveis do estudante
 *         phone_number:
 *           type: string
 *           description: Número de telefone dos responsáveis
 *         special_needs:
 *           type: string
 *           description: Necessidades especiais, se houver
 *         status:
 *           type: string
 *           description: Status do estudante (ativo/inativo)
 *       example:
 *         id: "id correspondente"
 *         name: ""
 *         age: "idade do aluno"
 *         parents: "nome dos responsalveis"
 *         phone_number: "xx xxxx-xxxx"
 *         special_needs: "doença"
 *         status: on/off
 */

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: CRUD de estudantes
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */
router.get('/', (req, res) => {
    res.json(studentsDB);
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: Retorna os dados do estudante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const student = studentsDB.find(student => student.id === id);
    if (!student) return res.status(404).json({ "erro": "Estudante não encontrado" });
    res.json(student);
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante (somente se tiver um usuário associado)
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: O estudante foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: O ID do estudante não está associado a nenhum usuário
 */
router.post('/', (req, res) => {
    const student = { ...req.body };

    const user = usersDB.find(user => user.id === student.id);
    if (!user) {
        return res.status(400).json({ "erro": "O ID do estudante não está associado a nenhum usuário" });
    }

    student.name = user.name;

    if (!student.age) return res.status(400).json({ "erro": "O estudante precisa ter uma idade" });
    if (!student.parents) return res.status(400).json({ "erro": "O estudante precisa ter pais ou responsáveis" });
    if (!student.phone_number) return res.status(400).json({ "erro": "O estudante precisa ter um número de telefone" });
    if (!student.special_needs) return res.status(400).json({ "erro": "O estudante precisa ter necessidades especiais" });
    if (!student.status) return res.status(400).json({ "erro": "O estudante precisa ter um status" });

    studentsDB.push(student);
    fs.writeFileSync(path.join(__dirname, '../db/students.json'), JSON.stringify(studentsDB, null, 2), 'utf8');
    
    return res.status(201).json(student); 
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza os dados de um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: O estudante foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const atualStudentIndex = studentsDB.findIndex(student => student.id === id);

    if (atualStudentIndex === -1) {
        return res.status(404).json({ "erro": "Estudante não encontrado" });
    }

    const newStudent = { ...req.body, id: studentsDB[atualStudentIndex].id };

    const user = usersDB.find(user => user.id === newStudent.id);
    if (!user) {
        return res.status(400).json({ "erro": "O ID do estudante não está associado a nenhum usuário" });
    }
    newStudent.name = user.name;

    if (!newStudent.age || !newStudent.parents || !newStudent.phone_number || !newStudent.special_needs || !newStudent.status) {
        return res.status(400).json({ "erro": "Todos os campos devem ser preenchidos." });
    }

    studentsDB[atualStudentIndex] = newStudent;
    fs.writeFileSync(path.join(__dirname, '../db/students.json'), JSON.stringify(studentsDB, null, 2), 'utf8');
    
    return res.json(newStudent);
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Deleta o estudante através do ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     responses:
 *       200:
 *         description: O estudante foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const atualStudentIndex = studentsDB.findIndex(student => student.id === id);

    if (atualStudentIndex === -1) return res.status(404).json({ "erro": "Estudante não encontrado" });

    const deletado = studentsDB.splice(atualStudentIndex, 1)[0];
    fs.writeFileSync(path.join(__dirname, '../db/students.json'), JSON.stringify(studentsDB, null, 2), 'utf8');

    return res.json(deletado);
});

module.exports = router;

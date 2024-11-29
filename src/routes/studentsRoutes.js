const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Modelos Mongoose
const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
}));

const Student = mongoose.model('Student', new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    parents: { type: String, required: true },
    phone_number: { type: String, required: true },
    special_needs: { type: String, required: true },
    status: { type: String, required: true },
    studentId: { type: String, unique: true, required: true },  // Novo campo 'studentId' para o estudante
}));

// Função para gerar um ID aleatório para o estudante
function generateStudentId() {
    return Math.random().toString(36).substring(2, 10);  // Gera um ID aleatório de 8 caracteres
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Student:
 *       type: object
 *       required:
 *         - name
 *         - age
 *         - parents
 *         - phone_number
 *         - special_needs
 *         - status
 *         - studentId
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do estudante no banco de dados
 *         name:
 *           type: string
 *           description: Nome do estudante
 *         age:
 *           type: string
 *           description: Idade do estudante
 *         parents:
 *           type: string
 *           description: Nome dos pais ou responsáveis
 *         phone_number:
 *           type: string
 *           description: Número de telefone do estudante ou responsável
 *         special_needs:
 *           type: string
 *           description: Necessidades especiais do estudante (se houver)
 *         status:
 *           type: string
 *           enum: [on, off]
 *           description: Status do estudante (ativo ou inativo)
 *         studentId:
 *           type: string
 *           description: ID único do estudante
 *       example:
 *         name: "João Silva"
 *         age: "12"
 *         parents: "Carlos Silva e Ana Silva"
 *         phone_number: "987654321"
 *         special_needs: "Nenhuma"
 *         status: "on"
 *         studentId: "a3b4c5d6"
 */

/**
 * @swagger
 * tags:
 *   - name: Students
 *     description: Gestão de estudantes
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: Lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 */

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do estudante
 *     responses:
 *       200:
 *         description: Estudante encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       201:
 *         description: Estudante criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Erro ao criar estudante (ID já em uso)
 */

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza os dados de um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Student'
 *     responses:
 *       200:
 *         description: Estudante atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Estudante não encontrado
 */

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Deleta o estudante através do ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do estudante
 *     responses:
 *       200:
 *         description: Estudante deletado com sucesso
 *       404:
 *         description: Estudante não encontrado
 */

router.get('/', async (req, res) => {
    try {
        const students = await Student.find(); // Carregar todos os estudantes
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estudantes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id); // Procurar estudante por ID
        if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estudante' });
    }
});

router.post('/', async (req, res) => {
    const { name, age, parents, phone_number, special_needs, status, studentId } = req.body;

    try {
        const existingStudent = await Student.findOne({ studentId });
        if (existingStudent) return res.status(400).json({ error: 'O ID do estudante já está em uso' });

        const finalStudentId = studentId || generateStudentId();

        const student = new Student({
            name,
            age,
            parents,
            phone_number,
            special_needs,
            status,
            studentId: finalStudentId,
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar estudante', details: error.message });
    }
});

router.put('/:id', async (req, res) => {
    const { name, age, parents, phone_number, special_needs, status, studentId } = req.body;

    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });

        student.name = name || student.name;
        student.age = age || student.age;
        student.parents = parents || student.parents;
        student.phone_number = phone_number || student.phone_number;
        student.special_needs = special_needs || student.special_needs;
        student.status = status || student.status;
        student.studentId = studentId || student.studentId;

        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estudante', details: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });
        res.json({ message: 'Estudante deletado com sucesso', student });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar estudante' });
    }
});

module.exports = router;

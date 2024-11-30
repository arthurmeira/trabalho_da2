const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Modelo do Estudante (Student)
const Student = mongoose.model('Student', new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: String, required: true },
    parents: { type: String, required: true },
    phone_number: { type: String, required: true },
    special_needs: { type: String, required: true },
    status: { type: String, required: true },
    studentId: { type: String, unique: true, required: true },
}));

// Função para gerar um ID aleatório para o estudante
function generateStudentId() {
    return Math.random().toString(36).substring(2, 10);  // Gera um ID aleatório de 8 caracteres
}

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

// Rotas para gerenciamento de estudantes (como você já tem no código)

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

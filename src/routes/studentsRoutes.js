const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// Modelos Mongoose
const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
}));

const Student = mongoose.model('Student', new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    age: { type: String, required: true },
    parents: { type: String, required: true },
    phone_number: { type: String, required: true },
    special_needs: { type: String, required: true },
    status: { type: String, required: true },
}));

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 */
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().populate('userId', 'name');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estudantes' });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 */
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('userId', 'name');
        if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar estudante' });
    }
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 */
router.post('/', async (req, res) => {
    const { userId, age, parents, phone_number, special_needs, status } = req.body;

    try {
        // Verificar se o usuário existe
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: 'O ID do estudante não está associado a nenhum usuário' });

        // Criar o estudante
        const student = new Student({
            name: user.name,
            userId,
            age,
            parents,
            phone_number,
            special_needs,
            status,
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar estudante' });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza os dados de um estudante pelo ID
 */
router.put('/:id', async (req, res) => {
    const { userId, age, parents, phone_number, special_needs, status } = req.body;

    try {
        // Verificar se o estudante existe
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });

        // Verificar se o usuário associado existe
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: 'O ID do estudante não está associado a nenhum usuário' });

        // Atualizar os dados do estudante
        student.name = user.name;
        student.userId = userId;
        student.age = age;
        student.parents = parents;
        student.phone_number = phone_number;
        student.special_needs = special_needs;
        student.status = status;

        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar estudante' });
    }
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Deleta o estudante através do ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar estudante' });
    }
});

module.exports = router;

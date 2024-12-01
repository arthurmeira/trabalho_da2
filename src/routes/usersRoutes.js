const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Definindo o esquema do usuário
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    user: { type: String, required: true },
    pwd: { type: String, required: true },
    level: { type: String, required: true },
    status: { type: String, required: true }
});

// Criando o modelo, garantindo que o modelo não seja redefinido
const User = mongoose.models.User || mongoose.model('User', userSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - user
 *         - pwd
 *         - level
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O ID do Usuário
 *         name:
 *           type: string
 *           description: Nome do Usuário
 *         email:
 *           type: string
 *           description: E-mail do Usuário
 *         user:
 *           type: string
 *           description: Nome de usuário
 *         pwd:
 *           type: string
 *           description: Senha do Usuário
 *         level:
 *           type: string
 *           description: Nível de acesso
 *         status:
 *           type: string
 *           description: Status do Usuário
 *       example:
 *         name: "Arthur Meira"
 *         email: "arthur@exemplo.com"
 *         user: "arthur123"
 *         pwd: "senha123"
 *         level: "1"
 *         status: "on"
 */

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestão de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.find();  // Carregar os usuários do MongoDB
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
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
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
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
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 */
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao criar usuário', details: error.message });
    }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Encontrar o usuário pelo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar se a senha corresponde (certifique-se de que você está comparando de maneira segura)
    if (user.pwd !== senha) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    // Retornar o nível de acesso do usuário
    res.json({
      level: user.level,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário pelo ID
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
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Erro ao atualizar usuário', details: error.message });
    }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Deleta um usuário pelo ID
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
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
        res.status(200).json({ message: 'Usuário deletado' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
});

module.exports = router;

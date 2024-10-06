const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
let professionalsDB = require('../db/professionals.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Professionals:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - specialty
 *         - contact
 *         - phone_number
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: O id é gerado automaticamente no cadastro do Profissional
 *         name:
 *           type: string
 *           description: Nome do Profissional
 *         specialty:
 *           type: string
 *           description: Especialidade do Profissional
 *         contact:
 *           type: string
 *           description: Contato do Profissional
 *         phone_number:
 *           type: string
 *           description: Número de telefone do Profissional
 *         status:
 *           type: string
 *           description: Se o Profissional está ativo
 *       example:
 *         name: Nome aqui...
 *         specialty: Especialidade aqui...
 *         contact: Contato aqui...
 *         phone_number: Número aqui...
 *         status: Status aqui (on / off)...
 */

/**
 * @swagger
 * tags:
 *   - name: Professionals
 *     description: >
 *       API ENSINO ESPECIAL |   
 *       **CHAIN**
 */

/**
 * @swagger
 * /professionals:
 *   get:
 *     summary: Retorna uma lista de todos os profissionais
 *     tags: [Professionals]
 *     responses:
 *       200:
 *         description: A lista de profissionais
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professionals'
 */
router.get('/', (req, res) => {
    res.json(professionalsDB);
});

/**
 * @swagger
 * /professionals/{id}:
 *   get:
 *     summary: Retorna um profissional pelo ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Profissional
 *     responses:
 *       200:
 *         description: Retorna os dados do profissional
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professionals'
 *       404:
 *         description: Profissional não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const professional = professionalsDB.find(prof => prof.id === id);
    if (!professional) return res.status(404).json({ "erro": "Profissional não encontrado" });
    res.json(professional);
});

/**
 * @swagger
 * /professionals:
 *   post:
 *     summary: Cria um novo profissional
 *     tags: [Professionals]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professionals'
 *     responses:
 *       201:
 *         description: O Profissional foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professionals'
 */
router.post('/', (req, res) => {
    const { name, specialty, contact, phone_number, status } = req.body;

    // Validações
    if (!name) return res.status(400).json({ "erro": "O Profissional tem que ter um nome" });
    if (!specialty) return res.status(400).json({ "erro": "O Profissional tem que ter uma especialidade" });
    if (!contact) return res.status(400).json({ "erro": "O Profissional precisa ter um contato" });
    if (!phone_number) return res.status(400).json({ "erro": "O Profissional precisa de um número de telefone" });
    if (!status) return res.status(400).json({ "erro": "O Profissional precisa ter um status" });

    // Cria um novo profissional com um ID gerado automaticamente
    const professional = { id: uuidv4(), name, specialty, contact, phone_number, status };

    // Adiciona o profissional à lista
    professionalsDB.push(professional);
    fs.writeFileSync(path.join(__dirname, '../db/professionals.json'), JSON.stringify(professionalsDB, null, 2), 'utf8');

    return res.status(201).json(professional);
});

/**
 * @swagger
 * /professionals/{id}:
 *   put:
 *     summary: Atualiza os dados de um Profissional pela ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Profissional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professionals'
 *     responses:
 *       200:
 *         description: O Profissional foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professionals'
 *       404:
 *         description: Profissional não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const atualProfIndex = professionalsDB.findIndex(atualProf => atualProf.id === id);

    if (atualProfIndex === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado" });
    }

    const newProf = { ...req.body, id: professionalsDB[atualProfIndex].id };

    // Validações
    if (!newProf.name || !newProf.specialty || !newProf.contact || !newProf.phone_number || !newProf.status) {
        return res.status(400).json({ "erro": "Todos os campos devem ser preenchidos." });
    }

    professionalsDB[atualProfIndex] = newProf;
    fs.writeFileSync(path.join(__dirname, '../db/professionals.json'), JSON.stringify(professionalsDB, null, 2), 'utf8');

    return res.json(newProf);
});

/**
 * @swagger
 * /professionals/{id}:
 *   delete:
 *     summary: Deleta o Profissional através do ID
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Profissional
 *     responses:
 *       200:
 *         description: O Profissional foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professionals'
 *       404:
 *         description: Profissional não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const atualProfIndex = professionalsDB.findIndex(prof => prof.id === id);

    if (atualProfIndex === -1) return res.status(404).json({ "erro": "Profissional não encontrado" });

    const deletado = professionalsDB.splice(atualProfIndex, 1)[0];
    fs.writeFileSync(path.join(__dirname, '../db/professionals.json'), JSON.stringify(professionalsDB, null, 2), 'utf8');

    return res.json(deletado);
});

module.exports = router;

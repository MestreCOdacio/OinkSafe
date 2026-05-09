// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json()); // Permite ao servidor receber JSON do front-end

// Rota para Registar Utilizador
app.post('/api/registrar', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Verificar se o email já existe
        db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) {
                return res.status(400).json({ message: 'Este email já está cadastrado!' });
            }

            // Encriptar a senha
            const hashSenha = await bcrypt.hash(senha, 10);

            // Inserir na base de dados
            const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
            db.query(sql, [nome, email, hashSenha], (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// Rota para Login
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.length === 0) {
            return res.status(400).json({ message: 'Email ou senha incorretos!' });
        }

        const usuario = results[0];
        
        // Comparar a senha enviada no frontend com a hash gravada na base de dados
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(400).json({ message: 'Email ou senha incorretos!' });
        }

        res.status(200).json({ 
            message: 'Login com sucesso', 
            usuario: { id: usuario.id_usuario, nome: usuario.nome, email: usuario.email } 
        });
    });
});

// --- ROTAS PARA AS METAS ---

// 1. Criar uma nova meta
app.post('/api/metas', (req, res) => {
    const { id_usuario, titulo, valor_alvo, valor_atual, cor_destaque } = req.body;

    const sql = 'INSERT INTO metas (id_usuario, titulo, valor_alvo, valor_atual, cor_destaque) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id_usuario, titulo, valor_alvo, valor_atual, cor_destaque], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Meta criada com sucesso!', id_meta: result.insertId });
    });
});

// 2. Listar as metas ativas de um utilizador específico (ignora as resgatadas para não poluir a tela)
app.get('/api/metas/:id_usuario', (req, res) => {
    const { id_usuario } = req.params;

    const sql = "SELECT * FROM metas WHERE id_usuario = ? AND status != 'resgatada'";
    db.query(sql, [id_usuario], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json(results);
    });
});

// 3. Excluir uma meta permanentemente
app.delete('/api/metas/:id_meta', (req, res) => {
    const { id_meta } = req.params;

    const sql = 'DELETE FROM metas WHERE id_meta = ?';
    db.query(sql, [id_meta], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Meta excluída com sucesso!' });
    });
});

// 4. Resgatar a meta (Atualizar status para 'resgatada')
app.put('/api/metas/resgatar/:id_meta', (req, res) => {
    const { id_meta } = req.params;

    const sql = "UPDATE metas SET status = 'resgatada' WHERE id_meta = ?";
    db.query(sql, [id_meta], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: 'Meta resgatada com sucesso!' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});
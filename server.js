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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
});
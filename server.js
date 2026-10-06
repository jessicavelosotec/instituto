const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345", // Digite aqui a sua senha do MySQL, se houver
    database: "instlogin"
});

// Conectar ao MySQL
db.connect((erro) => {
    if (erro) {
        console.error("❌ Erro ao conectar ao banco:", erro.message);
    } else {
        console.log("✅ Conectado ao banco de dados MySQL ('instituto')");
    }
});

// Rota de LOGIN
app.post("/login", (req, res) => {
    const { usuario, senha } = req.body; // usuario vem do campo de email

    const query = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
    db.query(query, [usuario, senha], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ sucesso: false, mensagem: "Erro no servidor." });
        }

        if (resultados.length > 0) {
            return res.json({ sucesso: true, mensagem: "Login realizado com sucesso!" });
        } else {
            return res.json({ sucesso: false, mensagem: "Usuário ou senha incorretos!" });
        }
    });
});

// Rota de CADASTRO
app.post("/cadastro", (req, res) => {
    const { usuario, senha } = req.body;

    // Verificar se o e-mail já está cadastrado
    const queryVerifica = "SELECT * FROM usuarios WHERE email = ?";
    db.query(queryVerifica, [usuario], (erro, resultados) => {
        if (erro) {
            return res.status(500).json({ sucesso: false, mensagem: "Erro ao verificar e-mail." });
        }

        if (resultados.length > 0) {
            return res.json({ sucesso: false, mensagem: "Este email já está cadastrado no banco de dados." });
        }

        // Inserir novo usuário
        const queryInserir = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";
        db.query(queryInserir, [usuario, senha], (erroInsercao) => {
            if (erroInsercao) {
                return res.status(500).json({ sucesso: false, mensagem: "Erro ao cadastrar usuário." });
            }

            return res.json({ sucesso: true, mensagem: "Cadastro realizado com sucesso!" });
        });
    });
});

// Iniciar o servidor
const PORTA = 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor Node rodando na porta ${PORTA}`);
});
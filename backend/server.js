const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const twilio = require('twilio');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({

    host: process.env.MYSQLHOST,

    user: process.env.MYSQLUSER,

    password: process.env.MYSQLPASSWORD,

    database: process.env.MYSQL_DATABASE,

    port: process.env.MYSQLPORT
});

console.log('Banco configurado');

const client = twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
);
app.post('/cadastro', (req, res) => {

    const {
        nome,
        telefone,
        endereco
    } = req.body;

    const sql = `
        INSERT INTO clientes
        (nome, telefone, endereco)
        VALUES (?, ?, ?)
    `;
    console.log('Tentando salvar:', nome, telefone, endereco);
    db.query(
        
        sql,
        [nome, telefone, endereco],

        async (err, result) => {

            if(err){

                console.log(err);

                return res.status(500).json({
                    erro: 'Erro ao cadastrar'
                });
            }
            console.log('Cliente salvo no banco:', result);
            try {

                await client.messages.create({

                    from: 'whatsapp:+14155238886',

                    to: `whatsapp:+55${telefone}`,

                    body:
`Olá ${nome} 👋

Seu cadastro foi realizado com sucesso!

Agora você receberá promoções exclusivas 🛒`
                });

                console.log('Mensagem enviada');

            } catch(error){

                console.log('Erro WhatsApp:', error);
            }

            res.json({
                mensagem: 'Cliente cadastrado com sucesso'
            });
        }
    );
});
app.get('/clientes', (req, res) => {
    const sql = 'SELECT * FROM clientes ORDER BY data_cadastro DESC';

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                erro: 'Erro ao buscar clientes'
            });
        }

        res.json(results);
    });
});

app.listen(3000, () => {

    console.log('Servidor rodando na porta 3000');
});
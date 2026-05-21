const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const twilio = require('twilio');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({

    host: 'localhost',
    user: 'root',
    password: '',
    database: 'clube_clientes'
});

db.connect((err) => {

    if(err){
        console.log('Erro ao conectar:', err);
    } else {
        console.log('Banco conectado');
    }
});

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

app.listen(3000, () => {

    console.log('Servidor rodando na porta 3000');
});
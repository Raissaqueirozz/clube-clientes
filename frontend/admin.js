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
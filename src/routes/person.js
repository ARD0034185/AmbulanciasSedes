const { Router } = require('express');
const router = Router();
 
const MysqlConnection = require('../database/database');
 
router.get('/', (req, res) => {
    res.status(200).json('Server on port 9090 and database is connected');
});
 
router.get('/persona', (req, res) => {
    MysqlConnection.query('SELECT * FROM Persona WHERE status = 1;', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
router.get('/persona/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('SELECT * FROM Persona WHERE id = ? AND status = 1;', [id], (error, rows, fields) => {
        if (!error && rows.length > 0) {
            res.json(rows[0]);
        } else if (!error && rows.length === 0) {
            res.status(404).json({ error: 'Person not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
router.post('/persona', (req, res) => {
    const { nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId } = req.body;
    MysqlConnection.query('INSERT INTO Persona(nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId, 1], (error, result) => {
            if (!error) {
                res.status(201).json({ Status: 'Person saved', id: result.insertId });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
router.put('/persona/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId } = req.body;
    MysqlConnection.query('UPDATE Persona SET nombres = ?, primerApellido = ?, segundoApellido = ?, carnet = ?, fechaNacimiento = ?, direccion = ?, celular = ?, lastUpdate = CURRENT_TIMESTAMP, UserId = ? WHERE id = ? AND status = 1;',
        [nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId, id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Person updated' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Person not found' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
router.delete('/persona/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('UPDATE Persona SET status = 0 WHERE id = ?;', [id], (error, result) => {
        if (!error && result.affectedRows > 0) {
            res.json({ Status: 'Person deleted' });
        } else if (!error && result.affectedRows === 0) {
            res.status(404).json({ error: 'Person not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
module.exports = router;
const { Router } = require('express');
const router = Router();
 
const MysqlConnection = require('../database/database');

// Obtener todo el seguimiento
router.get('/seguimiento', (req, res) => {
    MysqlConnection.query('SELECT s.id, s.chofer_id, p.nombres AS chofer_nombre, s.ambulancia_id, a.numero_placa, s.paciente_id, pac.nombres AS paciente_nombre, s.hora_salida, s.hora_llegada, s.lugar_accidente, s.estado_paciente, s.observaciones, s.UserId, s.status FROM seguimiento s INNER JOIN chofer c ON s.chofer_id = c.id INNER JOIN persona p ON c.id = p.id INNER JOIN ambulancia a ON s.ambulancia_id = a.id INNER JOIN paciente pac ON s.paciente_id = pac.id WHERE s.status = 1 LIMIT 0, 1000;', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// Obtener un seguimiento por su ID
router.get('/seguimiento/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('SELECT * FROM Seguimiento WHERE id = ? AND status = 1;', [id], (error, rows, fields) => {
        if (!error && rows.length > 0) {
            res.json(rows[0]);
        } else if (!error && rows.length === 0) {
            res.status(404).json({ error: 'Seguimiento no encontrado' });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});

// Registrar nuevo seguimiento
router.post('/seguimiento', (req, res) => {
    const { chofer_id, ambulancia_id, paciente_id, hora_salida, hora_llegada, lugar_accidente, estado_paciente, observaciones, UserId } = req.body;

    MysqlConnection.query(
        'INSERT INTO Seguimiento (chofer_id, ambulancia_id, paciente_id, hora_salida, hora_llegada, lugar_accidente, estado_paciente, observaciones, UserId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)',
        [chofer_id, ambulancia_id, paciente_id, hora_salida, hora_llegada, lugar_accidente, estado_paciente, observaciones, UserId],
        (error, result) => {
            if (!error) {
                res.status(201).json({ Status: 'Seguimiento registrado', id: result.insertId });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    );
});

// Actualizar seguimiento
router.put('/seguimiento/:id', (req, res) => {
    const { id } = req.params;
    const { chofer_id, ambulancia_id, paciente_id, hora_salida, hora_llegada, lugar_accidente, estado_paciente, observaciones, UserId } = req.body;
    MysqlConnection.query('UPDATE Seguimiento SET chofer_id = ?, ambulancia_id = ?, paciente_id = ?, hora_salida = ?, hora_llegada = ?, lugar_accidente = ?, estado_paciente = ?, observaciones = ?, UserId = ?, lastUpdate = CURRENT_TIMESTAMP WHERE id = ? AND status = 1;',
        [chofer_id, ambulancia_id, paciente_id, hora_salida, hora_llegada, lugar_accidente, estado_paciente, observaciones, UserId, id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Seguimiento actualizado' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Seguimiento no encontrado' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});

// Eliminar seguimiento
router.delete('/seguimiento/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('UPDATE Seguimiento SET status = 0 WHERE id = ? AND status = 1;',
        [id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Seguimiento eliminado' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Seguimiento no encontrado' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});

module.exports = router;

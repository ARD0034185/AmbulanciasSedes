const { Router } = require('express');
const router = Router();
 
const MysqlConnection = require('../database/database');
 
// Obtener todos los pacientes
router.get('/paciente', (req, res) => {
    MysqlConnection.query('SELECT * FROM Paciente WHERE status = 1;', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Obtener un paciente por su ID
router.get('/paciente/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('SELECT * FROM Paciente WHERE id = ? AND status = 1;', [id], (error, rows, fields) => {
        if (!error && rows.length > 0) {
            res.json(rows[0]);
        } else if (!error && rows.length === 0) {
            res.status(404).json({ error: 'Patient not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Crear un nuevo paciente
router.post('/paciente', (req, res) => {
    const { nombres, primerApellido, segundoApellido, estado_paciente, carnet, fechaNacimiento, direccion, celular, direccion_accidente, nombre_entidad, persona_id, UserId } = req.body;
    MysqlConnection.query('INSERT INTO Paciente(nombres, primerApellido, segundoApellido, estado_paciente, carnet, fechaNacimiento, direccion, celular, direccion_accidente, nombre_entidad, persona_id, UserId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1);',
        [nombres, primerApellido, segundoApellido, estado_paciente, carnet, fechaNacimiento, direccion, celular, direccion_accidente, nombre_entidad, persona_id, UserId], (error, result) => {
            if (!error) {
                res.status(201).json({ Status: 'Patient saved', id: result.insertId });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
// Actualizar un paciente existente
router.put('/paciente/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, primerApellido, segundoApellido, estado_paciente, carnet, fechaNacimiento, direccion, celular, direccion_accidente, nombre_entidad, persona_id, UserId } = req.body;
    MysqlConnection.query('UPDATE Paciente SET nombres = ?, primerApellido = ?, segundoApellido = ?, estado_paciente = ?, carnet = ?, fechaNacimiento = ?, direccion = ?, celular = ?, direccion_accidente = ?, nombre_entidad = ?, persona_id = ?, UserId = ?, lastUpdate = CURRENT_TIMESTAMP WHERE id = ? AND status = 1;',
        [nombres, primerApellido, segundoApellido, estado_paciente, carnet, fechaNacimiento, direccion, celular, direccion_accidente, nombre_entidad, persona_id, UserId, id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Patient updated' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Patient not found' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
// Eliminar un paciente
router.delete('/paciente/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('UPDATE Paciente SET status = 0 WHERE id = ? AND status = 1;',
        [id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Patient deleted' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Patient not found' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
module.exports = router;
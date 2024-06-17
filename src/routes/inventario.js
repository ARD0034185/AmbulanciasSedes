const { Router } = require('express');
const router = Router();
 
const MysqlConnection = require('../database/database');
 
 
// Obtener todo el inventario
router.get('/inventario', (req, res) => {
    MysqlConnection.query('SELECT * FROM Inventario WHERE status = 1;', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Obtener un elemento de inventario por su ID
router.get('/inventario/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('SELECT * FROM Inventario WHERE id = ? AND status = 1;', [id], (error, rows, fields) => {
        if (!error && rows.length > 0) {
            res.json(rows[0]);
        } else if (!error && rows.length === 0) {
            res.status(404).json({ error: 'Inventory item not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Crear un nuevo elemento de inventario
router.post('/inventario', (req, res) => {
    const { nombre, cantidad, descripcion, UserId, ambulancia_id } = req.body;
    MysqlConnection.query('INSERT INTO Inventario(nombre, cantidad, descripcion, UserId, ambulancia_id, status) VALUES (?, ?, ?, ?, ?, 1);',
        [nombre, cantidad, descripcion, UserId, ambulancia_id], (error, result) => {
            if (!error) {
                res.status(201).json({ Status: 'Inventory item saved', id: result.insertId });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
// Actualizar un elemento de inventario existente
router.put('/inventario/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, cantidad, descripcion, UserId, ambulancia_id } = req.body;
    MysqlConnection.query('UPDATE Inventario SET nombre = ?, cantidad = ?, descripcion = ?, UserId = ?, ambulancia_id = ?, lastUpdate = CURRENT_TIMESTAMP WHERE id = ? AND status = 1;',
        [nombre, cantidad, descripcion, UserId, ambulancia_id, id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Inventory item updated' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Inventory item not found' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
// Eliminar un elemento de inventario
router.delete('/inventario/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('UPDATE Inventario SET status = 0 WHERE id = ? AND status = 1;',
        [id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Inventory item deleted' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Inventory item not found' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
module.exports = router;
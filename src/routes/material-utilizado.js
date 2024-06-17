const { Router } = require('express');
const router = Router();
 
const MysqlConnection = require('../database/database');
 
// Obtener todo el material utilizado
router.get('/materialutilizado', (req, res) => {
    MysqlConnection.query('SELECT mu.id, mu.inventario_id, i.nombre AS inventario_nombre, mu.ambulancia_id, a.numero_placa, mu.paciente_id, p.nombres AS paciente_nombre, mu.cantidad_utilizada, mu.UserId, mu.status FROM MaterialUtilizado mu INNER JOIN Inventario i ON mu.inventario_id = i.id INNER JOIN Ambulancia a ON mu.ambulancia_id = a.id INNER JOIN Paciente p ON mu.paciente_id = p.id WHERE mu.status = 1;', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Obtener un elemento de material utilizado por su ID
router.get('/materialutilizado/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('SELECT * FROM MaterialUtilizado WHERE id = ? AND status = 1;', [id], (error, rows, fields) => {
        if (!error && rows.length > 0) {
            res.json(rows[0]);
        } else if (!error && rows.length === 0) {
            res.status(404).json({ error: 'Material used not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Registrar nuevo material utilizado
// Crear un nuevo registro de material utilizado
router.post('/materialutilizado', (req, res) => {
    const { inventario_id, ambulancia_id, paciente_id, cantidad_utilizada, UserId } = req.body;

    // Iniciar una transacción para asegurar que ambas operaciones (inserción y actualización) se realicen de manera atómica
    MysqlConnection.beginTransaction(err => {
        if (err) {
            return res.status(500).json({ error: 'Transaction error' });
        }

        // Primero, actualizar la cantidad en la tabla Inventario
        MysqlConnection.query(
            'UPDATE Inventario SET cantidad = cantidad - ? WHERE id = ? AND status = 1',
            [cantidad_utilizada, inventario_id],
            (error, result) => {
                if (error) {
                    return MysqlConnection.rollback(() => {
                        res.status(500).json({ error: 'Internal server error' });
                    });
                }

                // Luego, insertar el registro en MaterialUtilizado
                MysqlConnection.query(
                    'INSERT INTO MaterialUtilizado (inventario_id, ambulancia_id, paciente_id, cantidad_utilizada, UserId, status) VALUES (?, ?, ?, ?, ?, 1)',
                    [inventario_id, ambulancia_id, paciente_id, cantidad_utilizada, UserId],
                    (error, result) => {
                        if (error) {
                            return MysqlConnection.rollback(() => {
                                res.status(500).json({ error: 'Internal server error' });
                            });
                        }

                        // Si todo salió bien, hacer commit de la transacción
                        MysqlConnection.commit(err => {
                            if (err) {
                                return MysqlConnection.rollback(() => {
                                    res.status(500).json({ error: 'Transaction commit error' });
                                });
                            }
                            res.status(201).json({ Status: 'Material utilizado registrado', id: result.insertId });
                        });
                    }
                );
            }
        );
    });
});
 
// Actualizar registro de material utilizado
router.put('/materialutilizado/:id', (req, res) => {
    const { id } = req.params;
    const { inventario_id, ambulancia_id, paciente_id, cantidad_utilizada, UserId } = req.body;
    MysqlConnection.query('UPDATE MaterialUtilizado SET inventario_id = ?, ambulancia_id = ?, paciente_id = ?, cantidad_utilizada = ?, UserId = ?, lastUpdate = CURRENT_TIMESTAMP WHERE id = ? AND status = 1;',
        [inventario_id, ambulancia_id, paciente_id, cantidad_utilizada, UserId, id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Material used updated' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Material used not found' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
// Eliminar registro de material utilizado
router.delete('/materialutilizado/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('UPDATE MaterialUtilizado SET status = 0 WHERE id = ? AND status = 1;',
        [id], (error, result) => {
            if (!error && result.affectedRows > 0) {
                res.json({ Status: 'Material used deleted' });
            } else if (!error && result.affectedRows === 0) {
                res.status(404).json({ error: 'Material used not found' });
            } else {
                console.log(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
});
 
module.exports = router;
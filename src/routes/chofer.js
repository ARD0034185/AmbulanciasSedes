const { Router } = require('express');
const router = Router();
 
const MysqlConnection = require('../database/database');
 
// Obtener todos los choferes
router.get('/chofer', (req, res) => {
    MysqlConnection.query('SELECT p.id, p.nombres, p.primerApellido, p.segundoApellido, p.carnet, p.fechaNacimiento, p.direccion, p.celular, p.UserId,    c.categoria_licencia, c.antecedentes, c.hora_Entrada, c.hora_Salida, c.sueldo FROM Persona p INNER JOIN Chofer c ON p.id = c.id WHERE c.status = 1;', (error, rows, fields) => {
        if (!error) {
            res.json(rows);
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Obtener un chofer por su ID
router.get('/chofer/:id', (req, res) => {
    const { id } = req.params;
    MysqlConnection.query('SELECT * FROM Chofer WHERE id = ? AND status = 1;', [id], (error, rows, fields) => {
        if (!error && rows.length > 0) {
            res.json(rows[0]);
        } else if (!error && rows.length === 0) {
            res.status(404).json({ error: 'Driver not found' });
        } else {
            console.log(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
});
 
// Crear un nuevo chofer
router.post('/chofer', (req, res) => {
    const { nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId, categoria_licencia, antecedentes, hora_Entrada, hora_Salida, sueldo, archivo} = req.body;
   
    // Insertar en la tabla Persona
    MysqlConnection.query('INSERT INTO persona(nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId) VALUES (?, ?, ?, ?, ?, ?, ?, ?);',
        [nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
           
            // Obtener el ID generado para la persona  
            const personaId = result.insertId;
 
            // Insertar en la tabla Chofer
            MysqlConnection.query('INSERT INTO chofer(id, categoria_licencia, antecedentes, hora_Entrada, hora_Salida, sueldo, UserId, archivo) VALUES (?, ?, ?, ?, ?, ?, ?,?);',
                [personaId, categoria_licencia, antecedentes, hora_Entrada, hora_Salida, sueldo, UserId, archivo], (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
                   
                    res.status(201).json({ Status: 'Driver saved', id: personaId });
                });
        });
});
 
 
// Actualizar un chofer existente
router.put('/chofer/:id', (req, res) => {
    const { id } = req.params;
    const { nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId, categoria_licencia, antecedentes, hora_Entrada, hora_Salida, sueldo } = req.body;
 
    // Actualizar los datos en la tabla Persona
    MysqlConnection.query('UPDATE Persona SET nombres = ?, primerApellido = ?, segundoApellido = ?, carnet = ?, fechaNacimiento = ?, direccion = ?, celular = ?, lastUpdate = CURRENT_TIMESTAMP, UserId = ? WHERE id = ? AND status = 1',
        [nombres, primerApellido, segundoApellido, carnet, fechaNacimiento, direccion, celular, UserId, id], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
 
            // Verificar si se afectaron filas en la tabla Persona
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Driver not found' });
            }
 
            // Una vez que se hayan actualizado los datos en la tabla Persona, actualizamos los datos en la tabla Chofer
            MysqlConnection.query('UPDATE Chofer SET categoria_licencia = ?, antecedentes = ?, hora_Entrada = ?, hora_Salida = ?, sueldo = ?, UserId = ? WHERE id = ? AND status = 1',
                [categoria_licencia, antecedentes, hora_Entrada, hora_Salida, sueldo, UserId, id], (error, result) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ error: 'Internal server error' });
                    }
 
                    // Verificar si se afectaron filas en la tabla Chofer
                    if (result.affectedRows === 0) {
                        return res.status(404).json({ error: 'Driver not found' });
                    }
 
                    // Si tanto los datos de la persona como del chofer se actualizaron correctamente, responder con éxito
                    res.json({ Status: 'Driver updated' });
                });
        });
});
 
// Eliminar un chofer
router.delete('/chofer/:id', (req, res) => {
    const { id } = req.params;
   
    // Actualizar el estado del chofer en la tabla Chofer
    MysqlConnection.query('UPDATE Chofer SET status = 0 WHERE id = ? AND status = 1', [id], (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
 
        // Verificar si se afectaron filas en la tabla Chofer
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Driver not found' });
        }
 
        // Una vez que se haya actualizado el estado del chofer en la tabla Chofer,
        // procedemos a actualizar el estado del chofer en la tabla Persona
        MysqlConnection.query('UPDATE Persona SET status = 0 WHERE id = ? AND status = 1', [id], (error, result) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
 
            // Verificar si se afectaron filas en la tabla Persona
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: 'Driver not found' });
            }
 
            // Si tanto el chofer como la persona se actualizaron correctamente, responder con éxito
            res.json({ Status: 'Driver deleted' });
        });
    });
});

module.exports = router;
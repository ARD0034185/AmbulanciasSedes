const mysql = require('mysql');

// Crear la conexión
const MysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Random619@',
    database: 'dbambulancia'
});

// Conectar a la base de datos
MysqlConnection.connect(function (error) {
    if (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    } else {
        console.log('La base de datos fue conectada con éxito :D!');
    }
});

// Manejar eventos de error en la conexión
MysqlConnection.on('error', function (err) {
    console.error('Error en la conexión a la base de datos:', err.message);
});

// Exportar la conexión para que pueda ser utilizada en otros módulos
module.exports = MysqlConnection;

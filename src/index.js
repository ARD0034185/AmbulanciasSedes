const express = require('express');
const app = express();
 
//settings
 
app.set( 'port' , process.env.PORT || 9090); // Establece el puerto en el valor de la variable de entorno PORT, o en 3000 si la variable de entorno no está definida
 
 
//middlewares
 
app.use(express.json());
 
//Routes
 
app.use(require('./routes/ambulancia'));
 
app.use(require('./routes//chofer'));
 
app.use(require('./routes/paciente'));
 
app.use(require('./routes/person'));
 
app.use(require('./routes/usuarios'));

app.use(require('./routes/inventario'));

app.use(require('./routes/material-utilizado'));

app.use(require('./routes/seguimiento'));
 
 
app.listen(app.get('port') ,() =>{
  console.log('Server on port ' , app.get('port'));
})
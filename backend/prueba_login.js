fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        cedula: '1234567890',
        password: 'astillero_seguro_2026'
    })
})
.then(respuesta => respuesta.json())
.then(datos => console.log('Respuesta del Login:', datos))
.catch(error => console.error('Error en la petición:', error));
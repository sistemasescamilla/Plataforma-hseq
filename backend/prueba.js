fetch('http://localhost:3000/api/auth/registro', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        cedula: '1234567890',
        nombre: 'Juan Sebastián',
        password: 'astillero_seguro_2026'
    })
})
.then(respuesta => respuesta.json())
.then(datos => console.log('Respuesta de la plataforma:', datos))
.catch(error => console.error('Error en la petición:', error));
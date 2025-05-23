function saludar() {
  alert("¡Hola desde JavaScript!");
  cargarUsuarios();
}

async function cargarUsuarios() {
  try {
    const respuesta = await fetch('http://localhost:5107/Adres/Adquisicion/Adquisiciones');
    if (!respuesta.ok) throw new Error('Error en la API');

    const data = await respuesta.json();
    console.log('Usuarios:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}
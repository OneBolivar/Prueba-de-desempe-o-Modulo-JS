import { http } from '../api/http.js';
import { saveSession } from '../utils.js';

export const initLoginController = () => {
  const loginForm = document.getElementById('login-form');
  
  // Se detiene la ejecución si el formulario no existe en el DOM actual
  if (!loginForm) {
    console.warn("Advertencia: No se encontró 'login-form' en el DOM.");
    return;
  }

  // Clonar y reemplazar el formulario para limpiar escuchadores previos en la SPA
  const newLoginForm = loginForm.cloneNode(true);
  loginForm.parentNode.replaceChild(newLoginForm, loginForm);

  // Registrar el evento de escucha para el inicio de sesión
  newLoginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación de campos vacíos
    if (!email || !password) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      // JSON Server retorna un Array completo al usar filtros por parámetro (?email=...)
      const users = await http.get(`/users?email=${email}`);

      // Validar si el arreglo llegó vacío (usuario no encontrado)
      if (!users || users.length === 0) {
        alert('Las credenciales ingresadas no coinciden con ningún usuario registrado.');
        return;
      }

      // Extraer el primer objeto del arreglo devuelto por el servidor
      const user = users[0];

      // Validar la contraseña del objeto extraído
      if (user.password !== password) {
        alert('Contraseña incorrecta. Por favor, intente nuevamente.');
        return;
      }

      // Estructurar el objeto de sesión limpio omitiendo datos sensibles
      const sessionData = {
        id: user.id,
        email: user.email,
        role: user.role // 'admin' o 'user'
      };

      // Guardar la sesión de forma persistente en LocalStorage
      saveSession(sessionData);

      // Redireccionar al Home de la SPA mutando el Hash de la URL
      window.location.hash = '#/home';

    } catch (error) {
      console.error('Error crítico durante el inicio de sesión:', error);
      alert('Error de conexión. Asegúrate de que JSON Server esté corriendo en el puerto 3000.');
    }
  });
};

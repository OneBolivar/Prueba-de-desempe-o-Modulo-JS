// Guardar los datos de sesión en LocalStorage
export const saveSession = (sessionData) => {
  localStorage.setItem('session', JSON.stringify(sessionData));
};

// Recuperar los datos de sesión activos
export const getSession = () => {
  const session = localStorage.getItem('session');
  return session ? JSON.parse(session) : null;
};

// Eliminar por completo los datos al cerrar sesión
export const removeSession = () => {
  localStorage.removeItem('session');
};

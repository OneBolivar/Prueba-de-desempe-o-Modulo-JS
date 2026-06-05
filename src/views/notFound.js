export const notFound = () => {
  return `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div class="text-center">
        <h1 class="text-9xl font-extrabold text-indigo-600 tracking-widest">404</h1>
        <div class="bg-red-500 text-white px-2 text-sm rounded rotate-12 absolute uppercase font-semibold inline-block -mt-16 ml-24">
          Página No Encontrada
        </div>
        <p class="text-2xl font-semibold text-gray-700 mt-4">Lo sentimos, este módulo o ruta no existe.</p>
        <p class="text-gray-500 mt-2 mb-6">Verifica la URL o asegúrate de tener los permisos necesarios.</p>
        <a 
          href="#/home" 
          class="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded shadow transition duration-200"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  `;
};

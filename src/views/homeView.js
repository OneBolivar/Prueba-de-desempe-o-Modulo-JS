export const homeView = (session) => {
  const isAdmin = session?.role === 'admin';

  return `
    <div class="min-h-screen bg-gray-50 flex">
      <!-- Barra lateral de navegación reutilizable -->
      <aside class="w-64 bg-indigo-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 class="text-xl font-bold mb-6 tracking-wide">Workspace SPA</h1>
          <nav class="space-y-2">
            <a href="#/home" class="block py-2.5 px-4 rounded bg-indigo-800 font-medium">Reservas</a>
            ${isAdmin ? `<a href="#/admin" class="block py-2.5 px-4 rounded hover:bg-indigo-800 transition">Panel Admin</a>` : ''}
          </nav>
        </div>
        <div>
          <p class="text-xs text-indigo-300 mb-2 truncate">${session?.email}</p>
          <span class="inline-block bg-indigo-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider mb-4">
            ${session?.role}
          </span>
          <button 
            id="logout-btn" 
            class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Contenedor de Contenido Principal -->
      <main class="flex-1 p-8 overflow-y-auto">
        <header class="mb-8">
          <h2 class="text-3xl font-bold text-gray-800">
            ${isAdmin ? 'Gestión Global de Reservas' : 'Mis Reservas de Espacios'}
          </h2>
          <p class="text-gray-600 mt-1">
            ${isAdmin ? 'Administra, aprueba o rechaza solicitudes de la empresa.' : 'Consulta la disponibilidad y gestiona tus agendas individuales.'}
          </p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Formulario de Creación de Reserva -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1 h-fit">
            <h3 class="text-lg font-bold text-gray-700 mb-4">Solicitar Nuevo Espacio</h3>
            <form id="reservation-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Espacio de Trabajo</label>
                <select id="space-select" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                  <option value="sp-1">Sala de Reuniones A</option>
                  <option value="sp-2">Oficina Privada Ejecutiva</option>
                  <option value="sp-3">Espacio Coworking Flexible</option>
                  <option value="sp-4">Auditorio Principal</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha</label>
                <input type="date" id="res-date" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Hora Inicio</label>
                  <input type="time" id="res-start" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Hora Fin</label>
                  <input type="time" id="res-end" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Motivo</label>
                <textarea id="res-reason" rows="3" required placeholder="Ej. Reunión mensual de equipo..." class="mt-1 block w-full border border-gray-300 rounded-md p-2"></textarea>
              </div>

              <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded transition">
                Confirmar Reserva
              </button>
            </form>
          </div>

          <!-- Listado Dinámico de Reservas -->
          <div class="lg:col-span-2">
            <h3 class="text-lg font-bold text-gray-700 mb-4">Historial y Estados</h3>
            <div id="reservations-list-container" class="space-y-3">
              <!-- El home.controller.js inyectará el contenido HTML aquí -->
              <p class="text-gray-500">Cargando registros del sistema...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
};

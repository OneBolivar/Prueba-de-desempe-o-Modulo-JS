export const adminView = (session) => {
  return `
    <div class="min-h-screen bg-gray-100 flex">
      <!-- Barra lateral de navegación -->
      <aside class="w-64 bg-indigo-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 class="text-xl font-bold mb-6 tracking-wide">Workspace Admin</h1>
          <nav class="space-y-2">
            <a href="#/home" class="block py-2.5 px-4 rounded hover:bg-indigo-800 transition">📅 Vista Usuario</a>
            <a href="#/admin" class="block py-2.5 px-4 rounded bg-indigo-800 font-medium">⚙️ Panel Admin</a>
          </nav>
        </div>
        <div>
          <p class="text-xs text-indigo-300 mb-2 truncate">${session?.email}</p>
          <span class="inline-block bg-green-600 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider mb-4">
            ${session?.role}
          </span>
          <button id="logout-btn" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium transition">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Panel de Control Administrativo -->
      <main class="flex-1 p-8 overflow-y-auto">
        <header class="mb-8">
          <h2 class="text-3xl font-bold text-gray-800">Dashboard Administrativo</h2>
          <p class="text-gray-600 mt-1">Consola gerencial de estadísticas globales y control de usuarios.</p>
        </header>

        <!-- 🚀 OPCIONAL: Estadísticas Generales de Uso Avanzadas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p class="text-sm font-medium text-gray-500 uppercase">Total Solicitudes</p>
            <p id="stat-total" class="text-3xl font-bold text-indigo-600 mt-2">0</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p class="text-sm font-medium text-gray-500 uppercase">Aprobadas</p>
            <p id="stat-approved" class="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p class="text-sm font-medium text-gray-500 uppercase">Pendientes</p>
            <p id="stat-pending" class="text-3xl font-bold text-amber-500 mt-2">0</p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <p class="text-sm font-medium text-gray-500 uppercase">Tasa de Ocupación</p>
            <p id="stat-rate" class="text-3xl font-bold text-purple-600 mt-2">0%</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Consola de Control de Reservas -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
            <h3 class="text-lg font-bold text-gray-700 mb-4">Consola de Control de Reservas</h3>
            <div id="admin-reservations-container" class="space-y-3">
              <p class="text-gray-500">Cargando registros globales...</p>
            </div>
          </div>

          <!-- 🚀 OPCIONAL: Ver todos los usuarios registrados -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
            <h3 class="text-lg font-bold text-gray-700 mb-4">Usuarios en el Sistema</h3>
            <div id="admin-users-container" class="space-y-3 divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              <p class="text-gray-500">Cargando cuentas registradas...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
};

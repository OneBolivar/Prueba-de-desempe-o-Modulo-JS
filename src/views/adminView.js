export const adminView = (session) => {
  return `
    <div class="min-h-screen bg-gray-100 flex">
      <!-- Barra lateral de navegación -->
      <aside class="w-64 bg-indigo-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 class="text-xl font-bold mb-6 tracking-wide">Workspace Admin</h1>
          <nav class="space-y-2">
            <a href="#/home" class="block py-2.5 px-4 rounded hover:bg-indigo-800 transition"> Vista Usuario</a>
            <a href="#/admin" class="block py-2.5 px-4 rounded bg-indigo-800 font-medium">YY Panel Admin</a>
          </nav>
        </div>
        <div>
          <p class="text-xs text-indigo-300 mb-2 truncate">${session?.email}</p>
          <span class="inline-block bg-green-600 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider mb-4">${session?.role}</span>
          <button id="logout-btn" class="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-medium transition">Cerrar Sesión</button>
        </div>
      </aside>

      <!-- Panel Administrativo -->
      <main class="flex-1 p-8 overflow-y-auto space-y-8">
        <header>
          <h2 class="text-3xl font-bold text-gray-800">Dashboard y Gestión de Espacios</h2>
          <p class="text-gray-600 mt-1">Métricas globales y administración del inventario físico.</p>
        </header>

        <!-- Indicadores rápidos -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </div>

        <!-- SECCIÓN CRUD DE ESPACIOS E INVENTARIO -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Formulario de Espacios -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
            <h3 id="space-form-title" class="text-lg font-bold text-gray-700 mb-4">Crear Nuevo Espacio</h3>
            <form id="space-form" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre del Espacio</label>
                <input type="text" id="space-name" required placeholder="Ej: Sala de Juntas B" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Espacio</label>
                <select id="space-type" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                  <option value="Sala">Sala de reuniones</option>
                  <option value="Oficina">Oficina privada</option>
                  <option value="Coworking">Espacio Coworking</option>
                  <option value="Auditorio">Auditorio</option>
                </select>
              </div>
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Capacidad</label>
                  <input type="number" id="space-capacity" required min="1" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Estado</label>
                  <select id="space-status" required class="mt-1 block w-full border border-gray-300 rounded-md p-2">
                    <option value="Disponible">Disponible</option>
                    <option value="No disponible">No disponible</option>
                  </select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Ubicación</label>
                <input type="text" id="space-location" required placeholder="Ej: Piso 2 - Ala Sur" class="mt-1 block w-full border border-gray-300 rounded-md p-2">
              </div>
              <button type="submit" id="space-submit-btn" class="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition">Guardar Espacio</button>
            </form>
          </div>

          <!-- Listado Tabla de Espacios -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
            <h3 class="text-lg font-bold text-gray-700 mb-4">Inventario de Espacios Existentes</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 text-sm text-left">
                <thead class="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
                  <tr>
                    <th class="p-3">Nombre</th>
                    <th class="p-3">Tipo</th>
                    <th class="p-3">Capacidad</th>
                    <th class="p-3">Estado</th>
                    <th class="p-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody id="admin-spaces-tbody" class="divide-y divide-gray-100">
                  <tr><td colspan="5" class="p-3 text-center text-gray-500">Cargando espacios...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- SECCIÓN DE RESERVAS Y USUARIOS EN PARALELO -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Listado Maestro de Control de Reservas -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
            <h3 class="text-lg font-bold text-gray-700 mb-4">Consola de Control de Reservas Globales</h3>
            <div id="admin-reservations-container" class="space-y-3">
              <p class="text-gray-500">Cargando solicitudes...</p>
            </div>
          </div>

          <!-- NUEVO CONTENEDOR: Lista de Usuarios en el Sistema -->
          <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 lg:col-span-1">
            <h3 class="text-lg font-bold text-gray-700 mb-4">Usuarios Registrados</h3>
            <div id="admin-users-container" class="space-y-3 divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              <p class="text-gray-500">Cargando cuentas...</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
};

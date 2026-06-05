export const loginView = () => {
  return `
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-bold text-gray-800">Workspace System</h2>
          <p class="text-gray-600 mt-2">Inicia sesión para gestionar tus espacios</p>
        </div>
        
        <form id="login-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              required 
              placeholder="ejemplo@test.com"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              required 
              placeholder="••••••••"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
          </div>
          
          <button 
            type="submit" 
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  `;
};

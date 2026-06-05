import { reservationService } from '../services/reservation.service.js';
import { http } from '../api/http.js';
import { getSession } from '../utils.js';

export const initAdminController = async () => {
  const session = getSession();
  if (!session || session.role !== 'admin') return;

  const resContainer = document.getElementById('admin-reservations-container');
  const usersContainer = document.getElementById('admin-users-container');
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('session');
      window.location.hash = '#/login';
    });
  }

  const loadAdminPanelData = async () => {
    try {
      // Cargar colecciones en paralelo desde el JSON Server
      const reservations = await reservationService.getAll();
      const users = await http.get('/users');

      // CÁLCULO DE ESTADÍSTICAS GENERALES DE USO (Puntos Extra)
      const total = reservations.length;
      const approvedCount = reservations.filter(r => (r.status || '').toLowerCase() === 'approved').length;
      const pendingCount = reservations.filter(r => (r.status || '').toLowerCase() === 'pending').length;
      const occupancyRate = total > 0 ? Math.round((approvedCount / total) * 100) : 0;

      
      document.getElementById('stat-total').textContent = total;
      document.getElementById('stat-approved').textContent = approvedCount;
      document.getElementById('stat-pending').textContent = pendingCount;
      document.getElementById('stat-rate').textContent = `${occupancyRate}%`;

      // 3. RENDERIZAR TODOS LOS USUARIOS REGISTRADOS (Puntos Extra)
      if (usersContainer) {
        usersContainer.innerHTML = users.map(user => `
          <div class="pt-3 flex items-center justify-between">
            <div class="truncate pr-2">
              <p class="text-sm font-medium text-gray-800">${user.name || 'Usuario sin nombre'}</p>
              <p class="text-xs text-gray-500 truncate">${user.email}</p>
            </div>
            <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }">${user.role}</span>
          </div>
        `).join('');
      }

      //  RENDERIZAR RESERVAS
      if (!resContainer) return;
      if (total === 0) {
        resContainer.innerHTML = '<p class="text-gray-500">No existen solicitudes en el sistema.</p>';
        return;
      }

      resContainer.innerHTML = reservations.map(res => {
        const currentStatus = (res.status || 'pending').toLowerCase();
        return `
          <div class="border p-4 rounded bg-gray-50 flex justify-between items-center shadow-sm">
            <div>
              <p class="text-gray-800"><strong>Espacio:</strong> ${res.workspace} (${res.date})</p>
              <p class="text-sm text-gray-600"><strong>Horario:</strong> ${res.startHour} - ${res.endHour} | <strong>ID Usuario:</strong> ${res.userId}</p>
              <p class="text-xs text-gray-500 mt-1"><strong>Motivo:</strong> ${res.reason || 'No especificado'}</p>
            </div>
            <div class="flex gap-2">
              ${currentStatus === 'pending' ? `
                <button class="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-medium btn-admin-approve" data-id="${res.id}">Aprobar</button>
                <button class="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded font-medium btn-admin-reject" data-id="${res.id}">Rechazar</button>
              ` : `
                <span class="text-xs font-bold uppercase px-2.5 py-1 rounded bg-gray-200 text-gray-700">${res.status}</span>
              `}
              <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-medium btn-admin-delete" data-id="${res.id}">Eliminar</button>
            </div>
          </div>
        `;
      }).join('');

      attachAdminEvents();
    } catch (err) {
      console.error("Error cargando componentes opcionales del Admin:", err);
    }
  };

  const attachAdminEvents = () => {
    resContainer.querySelectorAll('.btn-admin-approve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await reservationService.changeStatus(e.target.dataset.id, 'approved', session.role);
        loadAdminPanelData();
      });
    });

    resContainer.querySelectorAll('.btn-admin-reject').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await reservationService.changeStatus(e.target.dataset.id, 'rejected', session.role);
        loadAdminPanelData();
      });
    });

    resContainer.querySelectorAll('.btn-admin-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('¿Eliminar permanentemente esta reserva?')) {
          await reservationService.delete(e.target.dataset.id, session.role);
          loadAdminPanelData();
        }
      });
    });
  };

  await loadAdminPanelData();
};

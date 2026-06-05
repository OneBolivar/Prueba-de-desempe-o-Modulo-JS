import { reservationService } from '../services/reservation.service.js';
import { getSession } from '../utils.js';

export const initAdminController = async () => {
  const session = getSession();
  if (!session || session.role !== 'admin') return;

  const container = document.getElementById('admin-reservations-container');
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('session');
      window.location.hash = '#/login';
    });
  }

  const loadAdminPanel = async () => {
    try {
      const data = await reservationService.getAll();

      // Calcular estadísticas dinámicas para la sustentación
      document.getElementById('stat-total').textContent = data.length;
      document.getElementById('stat-approved').textContent = data.filter(r => (r.status || '').toLowerCase() === 'approved').length;
      document.getElementById('stat-pending').textContent = data.filter(r => (r.status || '').toLowerCase() === 'pending').length;

      if (!container) return;
      if (data.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No existen solicitudes en el sistema.</p>';
        return;
      }

      container.innerHTML = data.map(res => {
        const currentStatus = (res.status || 'pending').toLowerCase();
        return `
          <div class="border p-4 rounded bg-gray-50 flex justify-between items-center shadow-sm">
            <div>
              <p class="text-gray-800"><strong>Espacio:</strong> ${res.workspace} (${res.date})</p>
              <p class="text-sm text-gray-600"><strong>Horario:</strong> ${res.startHour} - ${res.endHour} | <strong>Usuario ID:</strong> ${res.userId}</p>
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
      console.error(err);
    }
  };

  const attachAdminEvents = () => {
    container.querySelectorAll('.btn-admin-approve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await reservationService.changeStatus(e.target.dataset.id, 'approved', session.role);
        loadAdminPanel();
      });
    });

    container.querySelectorAll('.btn-admin-reject').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await reservationService.changeStatus(e.target.dataset.id, 'rejected', session.role);
        loadAdminPanel();
      });
    });

    container.querySelectorAll('.btn-admin-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('¿Eliminar permanentemente de la base de datos?')) {
          await reservationService.delete(e.target.dataset.id, session.role);
          loadAdminPanel();
        }
      });
    });
  };

  await loadAdminPanel();
};

import { reservationService } from '../services/reservation.service.js';
import { http } from '../api/http.js';
import { getSession } from '../utils.js';

export const initAdminController = async () => {
  const session = getSession();
  if (!session || session.role !== 'admin') return;

  const resContainer = document.getElementById('admin-reservations-container');
  const spacesTbody = document.getElementById('admin-spaces-tbody');
  const usersContainer = document.getElementById('admin-users-container'); // Capturamos contenedor de usuarios
  const spaceForm = document.getElementById('space-form');
  const logoutBtn = document.getElementById('logout-btn');

  let editingSpaceId = null;

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('session');
      window.location.hash = '#/login';
    });
  }

  const loadAdminData = async () => {
    try {
      // Realizar peticiones HTTP paralelas a la base de datos simulada
      const reservations = await reservationService.getAll();
      const spaces = await http.get('/spaces');
      const users = await http.get('/users'); // Petición para traer usuarios

      //  Renderizar Estadísticas de Reservas
      document.getElementById('stat-total').textContent = reservations.length;
      document.getElementById('stat-approved').textContent = reservations.filter(r => (r.status || '').toLowerCase() === 'approved').length;
      document.getElementById('stat-pending').textContent = reservations.filter(r => (r.status || '').toLowerCase() === 'pending').length;

      //  RENDERIZAR LISTA DE USUARIOS REGISTRADOS
      if (usersContainer) {
        if (users.length === 0) {
          usersContainer.innerHTML = '<p class="text-gray-500 text-sm">No hay usuarios en la base de datos.</p>';
        } else {
          usersContainer.innerHTML = users.map(u => `
            <div class="pt-3 flex items-center justify-between text-sm">
              <div class="truncate pr-2">
                <p class="font-medium text-gray-800">${u.name || 'Sin nombre registrado'}</p>
                <p class="text-xs text-gray-500 truncate">${u.email}</p>
              </div>
              <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
              }">${u.role}</span>
            </div>
          `).join('');
        }
      }

      //  Renderizar Tabla de Espacios (CRUD - READ)
      if (spacesTbody) {
        if (spaces.length === 0) {
          spacesTbody.innerHTML = `<tr><td colspan="5" class="p-3 text-center text-gray-500">No hay espacios creados.</td></tr>`;
        } else {
          spacesTbody.innerHTML = spaces.map(sp => `
            <tr class="hover:bg-gray-50">
              <td class="p-3 font-medium text-gray-900">${sp.name} <br><span class="text-xs text-gray-400">${sp.location}</span></td>
              <td class="p-3 text-gray-600">${sp.type}</td>
              <td class="p-3 text-gray-600">${sp.capacity} pax</td>
              <td class="p-3"><span class="px-2 py-0.5 rounded text-xs font-bold ${sp.status === 'Disponible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${sp.status}</span></td>
              <td class="p-3 text-right space-x-1">
                <button class="text-blue-600 hover:text-blue-900 font-medium btn-space-edit" data-id="${sp.id}">Editar</button>
                <button class="text-red-600 hover:text-red-900 font-medium btn-space-delete" data-id="${sp.id}">Eliminar</button>
              </td>
            </tr>
          `).join('');
        }
      }

      //  Renderizar Lista Global de Reservas
      if (resContainer) {
        resContainer.innerHTML = reservations.map(res => {
          const currentStatus = (res.status || 'pending').toLowerCase();
          return `
            <div class="border p-4 rounded bg-gray-50 flex justify-between items-center shadow-sm">
              <div>
                <p class="text-gray-800"><strong>Espacio:</strong> ${res.workspace} (${res.date})</p>
                <p class="text-sm text-gray-600"><strong>Horario:</strong> ${res.startHour} - ${res.endHour} | <strong>Usuario ID:</strong> ${res.userId}</p>
              </div>
              <div class="flex gap-2">
                ${currentStatus === 'pending' ? `
                  <button class="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded font-medium btn-admin-approve" data-id="${res.id}">Aprobar</button>
                  <button class="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded font-medium btn-admin-reject" data-id="${res.id}">Rechazar</button>
                ` : `<span class="text-xs font-bold uppercase px-2.5 py-1 rounded bg-gray-200 text-gray-700">${res.status}</span>`}
                <button class="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-medium btn-admin-delete" data-id="${res.id}">Eliminar</button>
              </div>
            </div>
          `;
        }).join('');
      }

      attachEvents(spaces);
    } catch (err) {
      console.error(err);
    }
  };

  const attachEvents = (allSpaces) => {
    resContainer.querySelectorAll('.btn-admin-approve').forEach(b => b.addEventListener('click', async (e) => { await reservationService.changeStatus(e.target.dataset.id, 'approved', session.role); loadAdminData(); }));
    resContainer.querySelectorAll('.btn-admin-reject').forEach(b => b.addEventListener('click', async (e) => { await reservationService.changeStatus(e.target.dataset.id, 'rejected', session.role); loadAdminData(); }));
    resContainer.querySelectorAll('.btn-admin-delete').forEach(b => b.addEventListener('click', async (e) => { if(confirm('¿Eliminar reserva?')) { await reservationService.delete(e.target.dataset.id, session.role); loadAdminData(); } }));

    spacesTbody.querySelectorAll('.btn-space-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const space = allSpaces.find(s => s.id == id);
        if (space) {
          editingSpaceId = id;
          document.getElementById('space-name').value = space.name;
          document.getElementById('space-type').value = space.type;
          document.getElementById('space-capacity').value = space.capacity;
          document.getElementById('space-status').value = space.status;
          document.getElementById('space-location').value = space.location;
          
          document.getElementById('space-form-title').textContent = "Modificar Espacio";
          document.getElementById('space-submit-btn').textContent = "Guardar Cambios";
          document.getElementById('space-submit-btn').className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition";
        }
      });
    });

    spacesTbody.querySelectorAll('.btn-space-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('¿Estás seguro de eliminar permanentemente este espacio del inventario?')) {
          await http.delete(`/spaces/${e.target.dataset.id}`);
          loadAdminData();
        }
      });
    });
  };

  if (spaceForm) {
    const newForm = spaceForm.cloneNode(true);
    spaceForm.parentNode.replaceChild(newForm, spaceForm);

    newForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const spaceData = {
        name: document.getElementById('space-name').value.trim(),
        type: document.getElementById('space-type').value,
        capacity: parseInt(document.getElementById('space-capacity').value),
        status: document.getElementById('space-status').value,
        location: document.getElementById('space-location').value.trim()
      };

      try {
        if (editingSpaceId) {
          await http.put(`/spaces/${editingSpaceId}`, spaceData);
          alert('Espacio actualizado correctamente.');
          editingSpaceId = null;
          document.getElementById('space-form-title').textContent = "Crear Nuevo Espacio";
          document.getElementById('space-submit-btn').textContent = "Guardar Espacio";
          document.getElementById('space-submit-btn').className = "w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded transition";
        } else {
          spaceData.id = "sp-" + Date.now();
          await http.post('/spaces', spaceData);
          alert('Nuevo espacio registrado con éxito.');
        }
        newForm.reset();
        loadAdminData();
      } catch (err) {
        alert('Error operando el espacio.');
      }
    });
  }

  await loadAdminData();
};

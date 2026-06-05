import { reservationService } from '../services/reservation.service.js';
import { getSession } from '../utils.js';

export const initHomeController = async () => {
  const session = getSession();
  if (!session) return;

  const reservationForm = document.getElementById('reservation-form');
  const container = document.getElementById('reservations-list-container');
  const logoutBtn = document.getElementById('logout-btn');
  const spaceSelect = document.getElementById('space-select');

  // Control del estado global de edición dentro de la SPA
  let editingReservationId = null;

  // 1. Relación Dinámica: Poblar el selector de espacios desde la Base de Datos (/spaces)
  try {
    const { http } = await import('../api/http.js');
    const allSpaces = await http.get('/spaces');
    
    // Regla de negocio: Mostrar únicamente los espacios que se encuentran en estado 'Disponible'
    const availableSpaces = allSpaces.filter(s => s.status === 'Disponible');
    
    if (spaceSelect) {
      if (availableSpaces.length === 0) {
        spaceSelect.innerHTML = `<option value="">No hay espacios disponibles actualmente</option>`;
      } else {
        spaceSelect.innerHTML = availableSpaces.map(s => `
          <option value="${s.id}">${s.name} (${s.location} - Cap: ${s.capacity} pax)</option>
        `).join('');
      }
    }
  } catch (error) {
    console.error("Error cargando el catálogo dinámico de espacios:", error);
  }

  // 2. Manejo del Cierre de Sesión (Logout funcional mandatorio)
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('session');
      window.location.hash = '#/login';
    });
  }

  // 3. Función interna para renderizar la lista de reservas en tiempo real
  const renderReservations = async () => {
    try {
      // El Administrador ve todas las reservas; el usuario estándar solo ve las suyas
      const data = session.role === 'admin' 
        ? await reservationService.getAll() 
        : await reservationService.getByUserId(session.id);

      if (!container) return;

      if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No hay reservas registradas en el sistema.</p>';
        return;
      }

      // Mapeo dinámico leyendo de forma exacta la estructura de tu db.json
      container.innerHTML = data.map(res => {
        const currentStatus = (res.status || 'pending').toLowerCase();

        return `
          <div class="border p-4 mb-2 rounded bg-white shadow-sm flex justify-between items-center">
            <div>
              <p class="text-gray-800"><strong>Espacio:</strong> ${res.workspace || 'No asignado'} (${res.date || ''})</p>
              <p class="text-gray-600"><strong>Horario:</strong> ${res.startHour || '--:--'} - ${res.endHour || '--:--'}</p>
              <p class="text-gray-600"><strong>Solicitante ID:</strong> Usuario #${res.userId || 'Desconocido'}</p>
              <p class="text-gray-600"><strong>Estado:</strong> 
                <span class="uppercase font-bold text-sm tracking-wider ${
                  currentStatus === 'approved' ? 'text-green-600' : 
                  currentStatus === 'rejected' ? 'text-orange-600' : 
                  currentStatus === 'cancelled' ? 'text-red-600' : 'text-indigo-600'
                }">${res.status || 'pending'}</span>
              </p>
            </div>
            <div class="flex gap-2 flex-wrap max-w-xs justify-end">
              <!-- Botón Editar exclusivo para Admin -->
              ${session.role === 'admin' ? `
                <button class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium btn-edit" data-id="${res.id}">Editar</button>
              ` : ''}

              <!-- Comparación normalizada en minúsculas para asegurar visibilidad reactiva -->
              ${session.role === 'admin' && currentStatus === 'pending' ? `
                <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium btn-approve" data-id="${res.id}">Aprobar</button>
                <button class="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-sm font-medium btn-reject" data-id="${res.id}">Rechazar</button>
              ` : ''}
              
              ${(session.role === 'admin' || currentStatus === 'pending' || currentStatus === 'approved') && currentStatus !== 'cancelled' && currentStatus !== 'rejected' ? `
                <button class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium btn-cancel" data-id="${res.id}">Cancelar</button>
              ` : ''}

              ${session.role === 'admin' ? `
                <button class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-1.5 rounded text-sm font-medium btn-delete" data-id="${res.id}">Eliminar</button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');

      attachEventHandlers(data);
    } catch (err) {
      console.error("Error renderizando el historial de reservas:", err);
    }
  };

  // 4. Manejo de eventos de los botones de cada tarjeta de reserva
  const attachEventHandlers = (allReservations) => {
    container.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        const reservation = allReservations.find(r => r.id == id);
        
        if (reservation) {
          editingReservationId = id; // Capturar ID del recurso en edición
          
          if (spaceSelect) {
            for (let i = 0; i < spaceSelect.options.length; i++) {
              if (spaceSelect.options[i].text.includes(reservation.workspace)) {
                spaceSelect.selectedIndex = i;
                break;
              }
            }
          }

          document.getElementById('res-date').value = reservation.date;
          document.getElementById('res-start').value = reservation.startHour;
          document.getElementById('res-end').value = reservation.endHour;
          document.getElementById('res-reason').value = reservation.reason || '';

          const submitBtn = reservationForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.textContent = 'Guardar Cambios (Edición)';
            submitBtn.classList.replace('bg-indigo-600', 'bg-blue-600');
          }
        }
      });
    });

    container.querySelectorAll('.btn-approve').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await reservationService.changeStatus(e.target.dataset.id, 'approved', session.role);
        await renderReservations();
      });
    });

    container.querySelectorAll('.btn-reject').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        await reservationService.changeStatus(e.target.dataset.id, 'rejected', session.role);
        await renderReservations();
      });
    });

    container.querySelectorAll('.btn-cancel').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        try {
          await reservationService.changeStatus(e.target.dataset.id, 'cancelled', session.role);
          await renderReservations();
        } catch (error) {
          alert(error.message);
        }
      });
    });

    container.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        if (confirm('¿Seguro que deseas eliminar permanentemente esta reserva?')) {
          await reservationService.delete(e.target.dataset.id, session.role);
          await renderReservations();
        }
      });
    });
  };

  // 5. Manejo unificado del formulario (Creación y Edición Blindada)
  if (reservationForm) {
    const newForm = reservationForm.cloneNode(true);
    reservationForm.parentNode.replaceChild(newForm, reservationForm);

    newForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (spaceSelect && !spaceSelect.value) {
        alert('Por favor, selecciona un espacio de trabajo válido.');
        return;
      }

      // Extraer el texto limpio del nombre del espacio sin los metadatos de capacidad
      const fullText = spaceSelect.options[spaceSelect.selectedIndex].text;
      const cleanWorkspaceName = fullText.split(' (')[0];

      const reservationData = {
        workspace: cleanWorkspaceName,
        date: document.getElementById('res-date').value,
        startHour: document.getElementById('res-start').value,
        endHour: document.getElementById('res-end').value,
        reason: document.getElementById('res-reason').value,
        status: 'pending' // Estado base por defecto
      };

      try {
        if (editingReservationId) {
          // BLINDAJE DE IDENTIDAD: Recuperar creador original antes de actualizar en BD
          const allRes = await reservationService.getAll();
          const currentRes = allRes.find(r => r.id == editingReservationId);
          
          reservationData.userId = currentRes ? currentRes.userId : session.id;
          reservationData.status = currentRes ? currentRes.status : 'pending';

          await reservationService.update(editingReservationId, reservationData, session.role);
          alert('Reserva modificada exitosamente.');
          
          editingReservationId = null;
          const submitBtn = newForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.textContent = 'Confirmar Reserva';
            submitBtn.classList.replace('bg-blue-600', 'bg-indigo-600');
          }
        } else {
          // MODO CREACIÓN: El dueño de la reserva es el usuario activo
          reservationData.userId = session.id;
          await reservationService.create(reservationData);
          alert('Reserva creada exitosamente.');
        }

        newForm.reset();
        await renderReservations();
      } catch (error) {
        alert(error.message); // Muestra la alerta si colisionan los rangos de horas
      }
    });
  }
await renderReservations();
};
  

import { http } from '../api/http.js';

export const reservationService = {
  // Obtiene todas las reservas
  getAll: async () => {
    return await http.get('/reservations');
  },

  // Obtiene únicamente las reservas de un usuario específico
  getByUserId: async (userId) => {
    const allReservations = await http.get('/reservations');
    
    // Comparacion con doble igual para que sirva si es numero o si es string
    return allReservations.filter(res => res.userId == userId);
  },


  // Crea una reserva aplicando la regla de negocio de no duplicidad
  create: async (reservationData) => {
    const reservations = await http.get('/reservations');
    
    //  Validacion de que no exista choque de horario en el mismo espacio
    const isOverlapping = reservations.some(res => 
      res.spaceId === reservationData.spaceId &&
      res.date === reservationData.date &&
      res.status !== 'Cancelled' && res.status !== 'Rejected' && (
        (reservationData.startTime >= res.startTime && reservationData.startTime < res.endTime) ||
        (reservationData.endTime > res.startTime && reservationData.endTime <= res.endTime) ||
        (reservationData.startTime <= res.startTime && reservationData.endTime >= res.endTime)
      )
    );

    if (isOverlapping) {
      throw new Error('El espacio ya se encuentra reservado en el horario seleccionado.');
    }

    // Inicializar estado por defecto como Pendiente
    const newReservation = {
      ...reservationData,
      status: 'Pending'
    };

    return await http.post('/reservations', newReservation);
  },

  // Actualizar una reserva controlando las reglas de estado
  update: async (id, updatedData, userRole) => {
    // Si el usuario es estándar, solo puede modificar si sigue Pendiente
    if (userRole !== 'admin') {
      const current = await http.get(`/reservations/${id}`);
      if (current.status !== 'pending') {
        throw new Error('Solo puedes modificar reservas en estado pendiente.');
      }
    }
    // Hace la actualización en la base de datos simulada
    return await http.put(`/reservations/${id}`, updatedData);
  },

  // Cambia de estado (Aprobar/Rechazar/Cancelar)
  changeStatus: async (id, newStatus, userRole) => {
    const current = await http.get(`/reservations/${id}`);

    // Regla de negocio: Un usuario estándar solo puede cancelar
    if (userRole !== 'admin' && newStatus === 'Cancelled') {
      // Las aprobadas solo pueden cancelarse, las pendientes también
      if (current.status === 'Rejected') {
        throw new Error('No se puede cancelar una reserva ya rechazada.');
      }
    }

    // Aprobar o Rechazar es exclusivo de Administradores
    if ((newStatus === 'Approved' || newStatus === 'Rejected') && userRole !== 'admin') {
      throw new Error('No tienes permisos para modificar el estado de esta reserva.');
    }

    return await http.put(`/reservations/${id}`, { ...current, status: newStatus });
  },

  // Eliminar reserva (Exclusivo Admin)
  delete: async (id, userRole) => {
    if (userRole !== 'admin') {
      throw new Error('Acceso denegado: Solo el administrador puede eliminar registros.');
    }
    return await http.delete(`/reservations/${id}`);
  }
};

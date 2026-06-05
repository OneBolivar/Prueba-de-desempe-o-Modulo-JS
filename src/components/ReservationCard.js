export default function ReservationCard(reservation) {
  const { workspace, date, startHour, endHour, reason, status } = reservation;
  return `
    <article
      class="rounded"
    >
      <h3 class="font-bold text-lg">
        ${workspace}
      </h3>

      <div class="">

        <p>
          Fecha:
          ${date}
        </p>

        <p>
          Horario:
          ${startHour}
          -
          ${endHour}
        </p>

        <p>
          Motivo:
          ${reason}
        </p>

        <p>
          Estado:
          <span class="">
            ${status}
          </span>
        </p>

      </div>
    </article>
  `;
}

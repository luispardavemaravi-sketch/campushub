const estilos = {
  disponible: 'status-available',
  mantenimiento: 'status-maintenance',
  pendiente: 'status-pending',
  aprobada: 'status-approved',
  rechazada: 'status-rejected',
  cancelada: 'status-cancelled'
};

const etiquetas = {
  disponible: 'Disponible',
  mantenimiento: 'Mantenimiento',
  pendiente: 'Pendiente',
  aprobada: 'Aprobada',
  rechazada: 'Rechazada',
  cancelada: 'Cancelada'
};

export default function BadgeEstado({ estado }) {
  const clase = estilos[estado] || 'status-neutral';
  const texto = etiquetas[estado] || estado || 'Sin estado';

  return (
    <span className={`status-badge ${clase}`}>
      {texto}
    </span>
  );
}
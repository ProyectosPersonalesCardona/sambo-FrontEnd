export default function formatearFecha(fecha) {
  const fechaNueva = new Date(fecha);

  return fechaNueva.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
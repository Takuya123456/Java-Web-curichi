// ════════════════════════════════════════
//  SIDEBAR Y NAVEGACIÓN - CURICHAZO
// ════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {

  const hamburger = document.querySelector('.hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.overlay');

  const abrirSidebar  = () => { sidebar.classList.add('open'); overlay.classList.add('show'); };
  const cerrarSidebar = () => { sidebar.classList.remove('open'); overlay.classList.remove('show'); };

  if (hamburger) hamburger.addEventListener('click', abrirSidebar);
  if (overlay)   overlay.addEventListener('click', cerrarSidebar);

  // Links del sidebar
  const navLinks = document.querySelectorAll('.sidebar nav a[data-page]');
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navegarA(link.dataset.page);
      cerrarSidebar();
    });
  });

  // Cerrar sesión
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('¿Seguro que deseas cerrar sesión?')) {
        document.getElementById('dashboard-screen').style.display = 'none';
        document.getElementById('login-screen').style.display    = 'flex';
        document.getElementById('inp-email').value = '';
        document.getElementById('inp-pass').value  = '';
      }
    });
  }
});

// ════════════════════════════════════════
//  FUNCIÓN CENTRAL DE NAVEGACIÓN
// ════════════════════════════════════════
function navegarA(pagina) {

  // Marcar link activo en sidebar
  const navLinks = document.querySelectorAll('.sidebar nav a[data-page]');
  navLinks.forEach(l => {
    l.classList.remove('activo');
    if (l.dataset.page === pagina) l.classList.add('activo');
  });

  // Breadcrumb y botón volver
  const link         = document.querySelector(`.sidebar nav a[data-page="${pagina}"]`);
  const nombrePagina = link ? link.querySelector('span').textContent : pagina;
  const sep          = document.getElementById('breadcrumb-sep');
  const bc           = document.getElementById('breadcrumb-page');
  const btnV         = document.getElementById('btn-volver');

  if (pagina === 'inicio') {
    if (sep) sep.style.display  = 'none';
    if (bc)  bc.style.display   = 'none';
    if (btnV) btnV.style.display = 'none';
  } else {
    if (bc)  { bc.textContent  = nombrePagina; bc.style.display = 'inline'; }
    if (sep) sep.style.display = 'inline';
    if (btnV) btnV.style.display = 'block';
  }

  // Mostrar página correspondiente
  document.querySelectorAll('.page').forEach(p => p.classList.remove('activa'));
  const target = document.getElementById('page-' + pagina);
  if (target) target.classList.add('activa');

  // Cargar datos según la página
  if (pagina === 'historial') cargarHistorial();
}

// ════════════════════════════════════════
//  API BASE URL
// ════════════════════════════════════════
const API = 'http://localhost:8080/api';

// ════════════════════════════════════════
//  LOGIN
// ════════════════════════════════════════
document.getElementById('btn-ingresar').addEventListener('click', () => {
  const email = document.getElementById('inp-email').value.trim();
  const pass  = document.getElementById('inp-pass').value.trim();
  const err   = document.getElementById('login-error');

  if (!email || !pass) {
    err.textContent = 'Por favor completa todos los campos.';
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';
  document.getElementById('login-screen').style.display    = 'none';
  document.getElementById('dashboard-screen').style.display = 'block';
  cargarTodo();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Enter' &&
      document.getElementById('login-screen').style.display !== 'none') {
    document.getElementById('btn-ingresar').click();
  }
});

// ════════════════════════════════════════
//  CARGAR TODO AL INICIAR
// ════════════════════════════════════════
function cargarTodo() {
  cargarClientes();
  cargarStock();
  cargarVentas();
  cargarFiados();
}

// ════════════════════════════════════════
//  CLIENTES
// ════════════════════════════════════════
function cargarClientes() {
  fetch(`${API}/clientes`)
    .then(r => r.json())
    .then(data => {
      const tbody = document.getElementById('table-cliente');
      tbody.innerHTML = '';
      data.forEach(c => {
        tbody.innerHTML += `
          <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.apellido}</td>
            <td>${c.telefono ?? '—'}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary fw-bold"
                  onclick="editarCliente(${c.id},'${c.nombre}','${c.apellido}','${c.telefono ?? ''}')">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger fw-bold"
                  onclick="confirmarEliminar('cliente',${c.id},'${c.nombre} ${c.apellido}')">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
      });
    })
    .catch(() => console.warn('Sin conexión al backend — clientes'));
}

function abrirModalCliente() {
  document.getElementById('modalClienteTitulo').textContent = 'Nuevo Cliente';
  ['cliente-id','cliente-nombre','cliente-apellido','cliente-telefono']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('cliente-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalCliente')).show();
}

function editarCliente(id, nombre, apellido, telefono) {
  document.getElementById('modalClienteTitulo').textContent = 'Editar Cliente';
  document.getElementById('cliente-id').value       = id;
  document.getElementById('cliente-nombre').value   = nombre;
  document.getElementById('cliente-apellido').value = apellido;
  document.getElementById('cliente-telefono').value = telefono;
  document.getElementById('cliente-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalCliente')).show();
}

function guardarCliente() {
  const err      = document.getElementById('cliente-error');
  const nombre   = document.getElementById('cliente-nombre').value.trim();
  const apellido = document.getElementById('cliente-apellido').value.trim();
  const telefono = document.getElementById('cliente-telefono').value.trim();
  const idEdit   = document.getElementById('cliente-id').value;

  if (!nombre || !apellido) {
    err.textContent = 'Nombre y apellido son obligatorios.';
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  const body   = JSON.stringify({ nombre, apellido, telefono });
  const url    = idEdit ? `${API}/clientes/${idEdit}` : `${API}/clientes`;
  const method = idEdit ? 'PUT' : 'POST';

  fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
      cargarClientes();
    })
    .catch(() => { err.textContent = 'Error al guardar.'; err.style.display = 'block'; });
}

// ════════════════════════════════════════
//  STOCK
// ════════════════════════════════════════
let _stockCache = [];

function cargarStock() {
  fetch(`${API}/stock`)
    .then(r => r.json())
    .then(data => {
      _stockCache = data;
      const tbody = document.getElementById('table-stock');
      tbody.innerHTML = '';
      data.forEach(s => {
        const badge = s.estado === 'Disponible'
          ? `<span class="badge-disponible">${s.estado}</span>`
          : s.estado === 'Bajo stock'
          ? `<span class="badge-bajstock">${s.estado}</span>`
          : `<span class="badge-agotado">${s.estado}</span>`;
        tbody.innerHTML += `
          <tr>
            <td>${s.id}</td>
            <td><strong>${s.producto}</strong></td>
            <td>${s.cantidad}</td>
            <td>S/ ${s.precio.toFixed(2)}</td>
            <td>${badge}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary fw-bold"
                  onclick="editarStock(${s.id},'${s.producto}',${s.cantidad},${s.precio},'${s.estado}')">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger fw-bold"
                  onclick="confirmarEliminar('stock',${s.id},'${s.producto}')">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
      });
      renderStockInicio(data);
    })
    .catch(() => console.warn('Sin conexión al backend — stock'));
}

function renderStockInicio(data) {
  const wrap   = document.getElementById('stock-pills');
  if (!wrap) return;
  wrap.innerHTML = '';
  const colores = [
    { bg:'#B8F4FF', text:'#005F73' },
    { bg:'#FFE8D6', text:'#9B3D00' },
    { bg:'#D8F3DC', text:'#1B4332' },
    { bg:'#FFF0F3', text:'#7D0023' },
    { bg:'#FFF3B0', text:'#6B4D00' },
  ];
  data.forEach((s, i) => {
    const c = colores[i % colores.length];
    wrap.innerHTML += `
      <span class="stock-pill" style="background:${c.bg};color:${c.text};"
        onclick="navegarA('stock')">
        🧊 ${s.producto}
      </span>`;
  });
}

function abrirModalStock() {
  document.getElementById('modalStockTitulo').textContent = 'Nuevo Producto';
  ['stock-id','stock-producto','stock-cantidad','stock-precio']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('stock-estado').value = 'Disponible';
  document.getElementById('stock-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalStock')).show();
}

function editarStock(id, producto, cantidad, precio, estado) {
  document.getElementById('modalStockTitulo').textContent = 'Editar Producto';
  document.getElementById('stock-id').value       = id;
  document.getElementById('stock-producto').value = producto;
  document.getElementById('stock-cantidad').value = cantidad;
  document.getElementById('stock-precio').value   = precio;
  document.getElementById('stock-estado').value   = estado;
  document.getElementById('stock-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalStock')).show();
}

function guardarStock() {
  const err      = document.getElementById('stock-error');
  const producto = document.getElementById('stock-producto').value.trim();
  const cantidad = parseInt(document.getElementById('stock-cantidad').value);
  const precio   = parseFloat(document.getElementById('stock-precio').value);
  const estado   = document.getElementById('stock-estado').value;
  const idEdit   = document.getElementById('stock-id').value;

  if (!producto || isNaN(cantidad) || isNaN(precio)) {
    err.textContent = 'Completa todos los campos.';
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  const body   = JSON.stringify({ producto, cantidad, precio, estado });
  const url    = idEdit ? `${API}/stock/${idEdit}` : `${API}/stock`;
  const method = idEdit ? 'PUT' : 'POST';

  fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById('modalStock')).hide();
      cargarStock();
    })
    .catch(() => { err.textContent = 'Error al guardar.'; err.style.display = 'block'; });
}

// ════════════════════════════════════════
//  VENTAS
// ════════════════════════════════════════
function cargarVentas() {
  fetch(`${API}/ventas`)
    .then(r => r.json())
    .then(data => {
      const tbody = document.getElementById('table-ventas');
      tbody.innerHTML = '';
      data.forEach(v => {
        tbody.innerHTML += `
          <tr>
            <td>${v.id}</td>
            <td>${v.nombre} ${v.apellido}</td>
            <td>${v.producto}</td>
            <td>${v.cantidad}</td>
            <td>S/ ${v.precio.toFixed(2)}</td>
            <td><strong>S/ ${v.total.toFixed(2)}</strong></td>
            <td>${v.fecha}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-outline-primary fw-bold"
                  onclick="editarVenta(${v.id},'${v.nombre}','${v.apellido}','${v.producto}',${v.cantidad},${v.precio},${v.total},'${v.fecha}')">
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger fw-bold"
                  onclick="confirmarEliminar('venta',${v.id},'${v.nombre} — ${v.producto}')">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
      });
    })
    .catch(() => console.warn('Sin conexión al backend — ventas'));
}

function abrirModalVenta() {
  document.getElementById('modalVentaTitulo').textContent = 'Nueva Venta';
  document.getElementById('venta-id').value      = '';
  document.getElementById('venta-nombre').value  = '';
  document.getElementById('venta-apellido').value = '';
  document.getElementById('venta-cantidad').value = 1;
  document.getElementById('venta-precio').value  = '';
  document.getElementById('venta-total').value   = '';
  document.getElementById('venta-error').style.display = 'none';
  document.getElementById('venta-fecha').value =
    new Date().toISOString().split('T')[0];
  // Llenar select de productos
  const sel = document.getElementById('venta-producto');
  sel.innerHTML = '<option value="">— Seleccionar —</option>';
  _stockCache.forEach(s => {
    sel.innerHTML += `<option value="${s.producto}" data-precio="${s.precio}">${s.producto}</option>`;
  });
  new bootstrap.Modal(document.getElementById('modalVenta')).show();
}

function actualizarPrecioVenta() {
  const sel    = document.getElementById('venta-producto');
  const opt    = sel.options[sel.selectedIndex];
  const precio = opt ? parseFloat(opt.dataset.precio) || 0 : 0;
  document.getElementById('venta-precio').value = precio.toFixed(2);
  calcularTotalVenta();
}

function calcularTotalVenta() {
  const cant   = parseFloat(document.getElementById('venta-cantidad').value) || 0;
  const precio = parseFloat(document.getElementById('venta-precio').value)   || 0;
  document.getElementById('venta-total').value = (cant * precio).toFixed(2);
}

function editarVenta(id, nombre, apellido, producto, cantidad, precio, total, fecha) {
  abrirModalVenta();
  setTimeout(() => {
    document.getElementById('modalVentaTitulo').textContent = 'Editar Venta';
    document.getElementById('venta-id').value       = id;
    document.getElementById('venta-nombre').value   = nombre;
    document.getElementById('venta-apellido').value = apellido;
    document.getElementById('venta-cantidad').value = cantidad;
    document.getElementById('venta-precio').value   = parseFloat(precio).toFixed(2);
    document.getElementById('venta-total').value    = parseFloat(total).toFixed(2);
    const partes = fecha.split('/');
    if (partes.length === 3)
      document.getElementById('venta-fecha').value = `${partes[2]}-${partes[1]}-${partes[0]}`;
    const sel = document.getElementById('venta-producto');
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === producto) { sel.selectedIndex = i; break; }
    }
  }, 80);
}

function guardarVenta() {
  const err      = document.getElementById('venta-error');
  const nombre   = document.getElementById('venta-nombre').value.trim();
  const apellido = document.getElementById('venta-apellido').value.trim();
  const producto = document.getElementById('venta-producto').value;
  const cantidad = parseInt(document.getElementById('venta-cantidad').value);
  const precio   = parseFloat(document.getElementById('venta-precio').value);
  const total    = parseFloat(document.getElementById('venta-total').value);
  const fechaRaw = document.getElementById('venta-fecha').value;
  const idEdit   = document.getElementById('venta-id').value;

  if (!nombre || !apellido || !producto || !cantidad || !precio || !fechaRaw) {
    err.textContent = 'Completa todos los campos.';
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  const partes = fechaRaw.split('-');
  const fecha  = `${partes[2]}/${partes[1]}/${partes[0]}`;
  const body   = JSON.stringify({ nombre, apellido, producto, cantidad, precio, total, fecha });
  const url    = idEdit ? `${API}/ventas/${idEdit}` : `${API}/ventas`;
  const method = idEdit ? 'PUT' : 'POST';

  fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById('modalVenta')).hide();
      cargarVentas();
    })
    .catch(() => { err.textContent = 'Error al guardar.'; err.style.display = 'block'; });
}

// ════════════════════════════════════════
//  FIADOS
// ════════════════════════════════════════
function cargarFiados() {
  fetch(`${API}/fiados`)
    .then(r => r.json())
    .then(data => {
      const tbody = document.getElementById('table-fiados');
      tbody.innerHTML = '';
      data.forEach(f => {
        tbody.innerHTML += `
          <tr>
            <td>${f.id}</td>
            <td><strong>${f.cliente}</strong></td>
            <td style="color:#E84040;font-weight:800;">S/ ${f.deuda.toFixed(2)}</td>
            <td>${f.fecha}</td>
            <td><span class="badge-pendiente">Pendiente</span></td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-success fw-bold"
                  onclick="marcarPagado(${f.id},'${f.cliente}',${f.deuda})">
                  <i class="fa-solid fa-check me-1"></i>Pagado
                </button>
                <button class="btn btn-sm btn-outline-danger fw-bold"
                  onclick="confirmarEliminar('fiado',${f.id},'${f.cliente}')">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>`;
      });
    })
    .catch(() => console.warn('Sin conexión al backend — fiados'));
}

function abrirModalFiado() {
  document.getElementById('modalFiadoTitulo').textContent = 'Nuevo Fiado';
  ['fiado-id','fiado-cliente','fiado-deuda'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('fiado-fecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('fiado-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalFiado')).show();
}

function guardarFiado() {
  const err     = document.getElementById('fiado-error');
  const cliente = document.getElementById('fiado-cliente').value.trim();
  const deuda   = parseFloat(document.getElementById('fiado-deuda').value);
  const fechaRaw= document.getElementById('fiado-fecha').value;

  if (!cliente || isNaN(deuda) || !fechaRaw) {
    err.textContent = 'Completa todos los campos.';
    err.style.display = 'block'; return;
  }
  err.style.display = 'none';

  const partes = fechaRaw.split('-');
  const fecha  = `${partes[2]}/${partes[1]}/${partes[0]}`;

  fetch(`${API}/fiados`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cliente, deuda, fecha, estado: 'Pendiente' })
  })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(() => {
      bootstrap.Modal.getInstance(document.getElementById('modalFiado')).hide();
      cargarFiados();
    })
    .catch(() => { err.textContent = 'Error al guardar.'; err.style.display = 'block'; });
}

// Marca fiado como pagado → lo mueve al historial en el backend
function marcarPagado(id, cliente, deuda) {
  if (!confirm(`¿Confirmar pago de ${cliente} por S/ ${parseFloat(deuda).toFixed(2)}?\nSe registrará en el historial.`)) return;

  fetch(`${API}/fiados/${id}/pagar`, { method: 'PATCH' })
    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
    .then(() => {
      cargarFiados();
      // Si historial está visible, recargarlo
      if (document.getElementById('page-historial').classList.contains('activa')) {
        cargarHistorial();
      }
    })
    .catch(() => alert('Error al registrar el pago.'));
}

// ════════════════════════════════════════
//  HISTORIAL DE PAGOS
// ════════════════════════════════════════
function cargarHistorial() {
  fetch(`${API}/historial`)
    .then(r => r.json())
    .then(data => {
      const wrap = document.getElementById('historial-list');
      wrap.innerHTML = '';

      if (data.length === 0) {
        wrap.innerHTML = `
          <div class="text-center py-5" style="color:var(--muted);">
            <i class="fa-solid fa-clock fa-2x mb-3" style="opacity:0.3;"></i>
            <p style="font-weight:700;">Aún no hay pagos registrados</p>
          </div>`;
        return;
      }

      // Ordenar del más reciente al más antiguo
      data.reverse().forEach(h => {
        const iniciales = h.cliente.split(' ')
          .slice(0, 2).map(p => p[0]).join('').toUpperCase();
        wrap.innerHTML += `
          <div class="historial-item">
            <div class="historial-avatar">${iniciales}</div>
            <div class="historial-info">
              <div class="historial-nombre">${h.cliente}</div>
              <div class="historial-fecha">
                <i class="fa-solid fa-calendar-check" style="color:var(--lime-dark);font-size:0.7rem;"></i>
                Fiado: ${h.fechaFiado} &nbsp;→&nbsp;
                <i class="fa-solid fa-check-circle" style="color:var(--lime-dark);font-size:0.7rem;"></i>
                Pagado: ${h.fechaPago}
              </div>
            </div>
            <div class="historial-monto">S/ ${h.deuda.toFixed(2)}</div>
          </div>`;
      });
    })
    .catch(() => console.warn('Sin conexión al backend — historial'));
}

// ════════════════════════════════════════
//  ELIMINAR UNIVERSAL
// ════════════════════════════════════════
function confirmarEliminar(tipo, id, descripcion) {
  document.getElementById('eliminar-desc').textContent = `Se eliminará: "${descripcion}"`;
  const btn = document.getElementById('btn-confirmar-eliminar');
  btn.onclick = () => {
    const endpoints = {
      cliente: 'clientes', stock: 'stock',
      venta: 'ventas',     fiado: 'fiados'
    };
    fetch(`${API}/${endpoints[tipo]}/${id}`, { method: 'DELETE' })
      .then(r => { if (r.status !== 204 && !r.ok) throw new Error(); })
      .then(() => {
        bootstrap.Modal.getInstance(document.getElementById('modalEliminar')).hide();
        if (tipo === 'cliente') cargarClientes();
        if (tipo === 'stock')   cargarStock();
        if (tipo === 'venta')   cargarVentas();
        if (tipo === 'fiado')   cargarFiados();
      })
      .catch(() => alert('Error al eliminar.'));
  };
  new bootstrap.Modal(document.getElementById('modalEliminar')).show();
}

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
    err.style.display = 'block'; 
    return;
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
async function cargarTodo() {
  await cargarClientes();
  await cargarStock();
  await cargarVentas();
  await cargarFiados();
}

// ════════════════════════════════════════
//  CLIENTES
// ════════════════════════════════════════
async function cargarClientes() {
  try {
    const response = await fetch(`${API}/clientes`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    const tbody = document.getElementById('table-cliente');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="text-center py-3">No hay clientes registrados</td></tr>`;
      return;
    }
    
    data.forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>${c.id || c.clienteId || '—'}</td>
          <td>${c.nombre || '—'}</td>
          <td>${c.apellido || '—'}</td>
          <td>${c.telefono || '—'}</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary fw-bold"
                onclick="editarCliente(${JSON.stringify(c).replace(/"/g, '&quot;')})">
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger fw-bold"
                onclick="confirmarEliminar('cliente',${c.id || c.clienteId},'${(c.nombre || '') + ' ' + (c.apellido || '')}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>`;
    });
  } catch (error) {
    console.error('Error cargando clientes:', error);
    document.getElementById('table-cliente').innerHTML = 
      `<tr><td colspan="5" class="text-center text-danger">Error al conectar con el servidor</td></tr>`;
  }
}

function abrirModalCliente() {
  document.getElementById('modalClienteTitulo').textContent = 'Nuevo Cliente';
  ['cliente-id', 'cliente-nombre', 'cliente-apellido', 'cliente-telefono']
    .forEach(id => document.getElementById(id).value = '');
  document.getElementById('cliente-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalCliente')).show();
}

function editarCliente(cliente) {
  document.getElementById('modalClienteTitulo').textContent = 'Editar Cliente';
  document.getElementById('cliente-id').value = cliente.id || cliente.clienteId || '';
  document.getElementById('cliente-nombre').value = cliente.nombre || '';
  document.getElementById('cliente-apellido').value = cliente.apellido || '';
  document.getElementById('cliente-telefono').value = cliente.telefono || '';
  document.getElementById('cliente-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalCliente')).show();
}

async function guardarCliente() {
  const err = document.getElementById('cliente-error');
  const nombre = document.getElementById('cliente-nombre').value.trim();
  const apellido = document.getElementById('cliente-apellido').value.trim();
  const telefono = document.getElementById('cliente-telefono').value.trim();
  const idEdit = document.getElementById('cliente-id').value;

  if (!nombre || !apellido) {
    err.textContent = 'Nombre y apellido son obligatorios.';
    err.style.display = 'block';
    return;
  }
  err.style.display = 'none';

  const body = JSON.stringify({ nombre, apellido, telefono });
  const url = idEdit ? `${API}/clientes/${idEdit}` : `${API}/clientes`;
  const method = idEdit ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body 
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    bootstrap.Modal.getInstance(document.getElementById('modalCliente')).hide();
    await cargarClientes();
    alert('✅ Cliente guardado correctamente');
  } catch (error) {
    console.error('Error guardando cliente:', error);
    err.textContent = 'Error al guardar. Verifica la conexión.';
    err.style.display = 'block';
  }
}

// ════════════════════════════════════════
//  STOCK
// ════════════════════════════════════════
let _stockCache = [];

async function cargarStock() {
  try {
    const response = await fetch(`${API}/stock`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    _stockCache = data;
    
    const tbody = document.getElementById('table-stock');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3">No hay productos en stock</td></tr>`;
      renderStockInicio([]);
      return;
    }
    
    data.forEach(s => {
      let badge = '';
      if (s.estado === 'Disponible') {
        badge = `<span class="badge-disponible">${s.estado}</span>`;
      } else if (s.estado === 'Bajo stock') {
        badge = `<span class="badge-bajstock">${s.estado}</span>`;
      } else {
        badge = `<span class="badge-agotado">${s.estado}</span>`;
      }
      
      tbody.innerHTML += `
        <tr>
          <td>${s.id || s.stockId || '—'}</td>
          <td><strong>${s.producto || '—'}</strong></td>
          <td>${s.cantidad || 0}</td>
          <td>S/ ${(s.precio || 0).toFixed(2)}</td>
          <td>${badge}</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary fw-bold"
                onclick='editarStock(${JSON.stringify(s)})'>
                <i class="fa-solid fa-pen"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger fw-bold"
                onclick="confirmarEliminar('stock',${s.id || s.stockId},'${s.producto || ''}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>`;
    });
    renderStockInicio(data);
  } catch (error) {
    console.error('Error cargando stock:', error);
    document.getElementById('table-stock').innerHTML = 
      `<tr><td colspan="6" class="text-center text-danger">Error al conectar con el servidor</td></tr>`;
  }
}

function renderStockInicio(data) {
  const wrap = document.getElementById('stock-pills');
  if (!wrap) return;
  wrap.innerHTML = '';
  
  if (data.length === 0) {
    wrap.innerHTML = '<span class="text-muted">No hay productos</span>';
    return;
  }
  
  const colores = [
    { bg: '#B8F4FF', text: '#005F73' },
    { bg: '#FFE8D6', text: '#9B3D00' },
    { bg: '#D8F3DC', text: '#1B4332' },
    { bg: '#FFF0F3', text: '#7D0023' },
    { bg: '#FFF3B0', text: '#6B4D00' },
  ];
  
  data.slice(0, 5).forEach((s, i) => {
    const c = colores[i % colores.length];
    wrap.innerHTML += `
      <span class="stock-pill" style="background:${c.bg};color:${c.text};cursor:pointer;"
        onclick="navegarA('stock')">
        🧊 ${s.producto || 'Producto'}
      </span>`;
  });
}

function abrirModalStock() {
  document.getElementById('modalStockTitulo').textContent = 'Nuevo Producto';
  document.getElementById('stock-id').value = '';
  document.getElementById('stock-producto').value = '';
  document.getElementById('stock-cantidad').value = '';
  document.getElementById('stock-precio').value = '';
  document.getElementById('stock-estado').value = 'Disponible';
  document.getElementById('stock-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalStock')).show();
}

function editarStock(stock) {
  document.getElementById('modalStockTitulo').textContent = 'Editar Producto';
  document.getElementById('stock-id').value = stock.id || stock.stockId || '';
  document.getElementById('stock-producto').value = stock.producto || '';
  document.getElementById('stock-cantidad').value = stock.cantidad || 0;
  document.getElementById('stock-precio').value = stock.precio || 0;
  document.getElementById('stock-estado').value = stock.estado || 'Disponible';
  document.getElementById('stock-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalStock')).show();
}

async function guardarStock() {
  const err = document.getElementById('stock-error');
  const producto = document.getElementById('stock-producto').value.trim();
  const cantidad = parseInt(document.getElementById('stock-cantidad').value);
  const precio = parseFloat(document.getElementById('stock-precio').value);
  const estado = document.getElementById('stock-estado').value;
  const idEdit = document.getElementById('stock-id').value;

  if (!producto || isNaN(cantidad) || isNaN(precio)) {
    err.textContent = 'Completa todos los campos correctamente.';
    err.style.display = 'block';
    return;
  }
  
  if (cantidad < 0) {
    err.textContent = 'La cantidad no puede ser negativa.';
    err.style.display = 'block';
    return;
  }
  
  err.style.display = 'none';

  const body = JSON.stringify({ producto, cantidad, precio, estado });
  const url = idEdit ? `${API}/stock/${idEdit}` : `${API}/stock`;
  const method = idEdit ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body 
    });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    bootstrap.Modal.getInstance(document.getElementById('modalStock')).hide();
    await cargarStock();
    alert('✅ Producto guardado correctamente');
  } catch (error) {
    console.error('Error guardando stock:', error);
    err.textContent = 'Error al guardar. Verifica la conexión.';
    err.style.display = 'block';
  }
}

// ════════════════════════════════════════
//  VENTAS
// ════════════════════════════════════════
async function cargarVentas() {
  try {
    const response = await fetch(`${API}/ventas`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    const tbody = document.getElementById('table-ventas');
    tbody.innerHTML = '';
    
    if (data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-3">No hay ventas registradas</td></tr>`;
      return;
    }
    
    data.forEach(v => {
      const nombre = v.nombre || '';
      const apellido = v.apellido || '';
      const comprador = (nombre + ' ' + apellido).trim() || 'Cliente sin nombre';
      const compradorEscapado = comprador.replace(/'/g, "\\'");
      
      tbody.innerHTML += `
        <tr>
          <td>${v.id || v.ventaId || '—'}</td>
          <td><strong>${comprador}</strong></td>
          <td>${v.producto || '—'}</td>
          <td>${v.cantidad || 0}</td>
          <td>S/ ${(v.precio ?? 0).toFixed(2)}</td>
          <td><strong>S/ ${(v.precioTotal ?? 0).toFixed(2)}</strong></td>
          <td>${v.fecha || '—'}</td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary fw-bold"
                onclick='editarVenta(${JSON.stringify(v)})'>
                <i class="fa-solid fa-pen me-1"></i>Editar
              </button>
              <button class="btn btn-sm btn-outline-danger fw-bold"
                onclick="confirmarEliminar('venta',${v.id || v.ventaId},'${compradorEscapado} — ${v.producto || ''}')">
                <i class="fa-solid fa-trash me-1"></i>Eliminar
              </button>
            </div>
          </td>
        </tr>`;
    });
  } catch (error) {
    console.error('Error cargando ventas:', error);
    document.getElementById('table-ventas').innerHTML = 
      `<tr><td colspan="8" class="text-center text-danger">Error al conectar con el servidor</td></tr>`;
  }
}

function abrirModalVenta() {
  document.getElementById('modalVentaTitulo').textContent = 'Nueva Venta';
  document.getElementById('venta-id').value = '';
  document.getElementById('venta-nombre').value = '';
  document.getElementById('venta-apellido').value = '';
  document.getElementById('venta-cantidad').value = 1;
  document.getElementById('venta-precio').value = '';
  document.getElementById('venta-total').value = '';
  document.getElementById('venta-error').style.display = 'none';
  document.getElementById('venta-fecha').value = new Date().toISOString().split('T')[0];
  
  const sel = document.getElementById('venta-producto');
  sel.innerHTML = '<option value="">— Seleccionar —</option>';
  
  if (_stockCache && _stockCache.length > 0) {
    _stockCache.forEach(s => {
      sel.innerHTML += `<option value="${s.producto}" data-precio="${s.precio}" data-id="${s.id}">${s.producto} (Stock: ${s.cantidad})</option>`;
    });
  } else {
    sel.innerHTML += '<option value="" disabled>No hay productos disponibles</option>';
  }
  
  new bootstrap.Modal(document.getElementById('modalVenta')).show();
}

function actualizarPrecioVenta() {
  const sel = document.getElementById('venta-producto');
  const opt = sel.options[sel.selectedIndex];
  const precio = opt && opt.dataset.precio ? parseFloat(opt.dataset.precio) : 0;
  document.getElementById('venta-precio').value = precio.toFixed(2);
  calcularTotalVenta();
}

function calcularTotalVenta() {
  const cant = parseFloat(document.getElementById('venta-cantidad').value) || 0;
  const precio = parseFloat(document.getElementById('venta-precio').value) || 0;
  document.getElementById('venta-total').value = (cant * precio).toFixed(2);
}

function editarVenta(venta) {
  abrirModalVenta();
  setTimeout(() => {
    document.getElementById('modalVentaTitulo').textContent = 'Editar Venta';
    document.getElementById('venta-id').value = venta.id || venta.ventaId || '';
    document.getElementById('venta-nombre').value = venta.nombre || '';
    document.getElementById('venta-apellido').value = venta.apellido || '';
    document.getElementById('venta-cantidad').value = venta.cantidad || 1;
    document.getElementById('venta-precio').value = (venta.precio || 0).toFixed(2);
    document.getElementById('venta-total').value = (venta.precioTotal || 0).toFixed(2);
    
    if (venta.fecha) {
      const partes = venta.fecha.split('/');
      if (partes.length === 3) {
        document.getElementById('venta-fecha').value = `${partes[2]}-${partes[1]}-${partes[0]}`;
      } else {
        document.getElementById('venta-fecha').value = venta.fecha;
      }
    }
    
    const sel = document.getElementById('venta-producto');
    for (let i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === venta.producto) {
        sel.selectedIndex = i;
        actualizarPrecioVenta();
        break;
      }
    }
  }, 100);
}

async function guardarVenta() {
  const err = document.getElementById('venta-error');
  const nombre = document.getElementById('venta-nombre').value.trim();
  const apellido = document.getElementById('venta-apellido').value.trim();
  const producto = document.getElementById('venta-producto').value;
  const cantidad = parseInt(document.getElementById('venta-cantidad').value);
  const precio = parseFloat(document.getElementById('venta-precio').value);
  const total = parseFloat(document.getElementById('venta-total').value);
  const fechaRaw = document.getElementById('venta-fecha').value;
  const idEdit = document.getElementById('venta-id').value;

  if (!nombre) {
    err.textContent = 'El nombre es obligatorio.';
    err.style.display = 'block';
    return;
  }
  
  if (!apellido) {
    err.textContent = 'El apellido es obligatorio.';
    err.style.display = 'block';
    return;
  }
  
  if (!producto) {
    err.textContent = 'Selecciona un producto.';
    err.style.display = 'block';
    return;
  }
  
  if (!cantidad || cantidad < 1) {
    err.textContent = 'La cantidad debe ser mayor a 0.';
    err.style.display = 'block';
    return;
  }
  
  if (!fechaRaw) {
    err.textContent = 'Selecciona una fecha.';
    err.style.display = 'block';
    return;
  }
  
  const productoStock = _stockCache.find(s => s.producto === producto);
  if (productoStock && cantidad > productoStock.cantidad) {
    err.textContent = `Stock insuficiente. Solo hay ${productoStock.cantidad} unidades de ${producto}.`;
    err.style.display = 'block';
    return;
  }
  
  err.style.display = 'none';

  const partes = fechaRaw.split('-');
  const fecha = `${partes[2]}/${partes[1]}/${partes[0]}`;
  
  const body = JSON.stringify({ 
    nombre, 
    apellido, 
    producto, 
    cantidad, 
    precio, 
    precioTotal: total,
    fecha 
  });
  
  const url = idEdit ? `${API}/ventas/${idEdit}` : `${API}/ventas`;
  const method = idEdit ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body 
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}`);
    }
    
    bootstrap.Modal.getInstance(document.getElementById('modalVenta')).hide();
    await cargarVentas();
    await cargarStock();
    alert('✅ Venta guardada correctamente');
    
  } catch (error) {
    console.error('Error guardando venta:', error);
    err.textContent = `Error al guardar: ${error.message}`;
    err.style.display = 'block';
  }
}

// ════════════════════════════════════════
//  FIADOS
// ════════════════════════════════════════
async function cargarFiados() {
  try {
    const response = await fetch(`${API}/fiados`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    
    const tbody = document.getElementById('table-fiados');
    tbody.innerHTML = '';
    
    if (!data || data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-3 text-muted">No hay fiados pendientes</td></tr>`;
      return;
    }
    
    data.forEach(f => {
      tbody.innerHTML += `
        <tr>
          <td>${f.id || f.fiadoId || '—'}</td>
          <td><strong>${f.nombre || '—'}</strong></td>
          <td style="color:#E84040;font-weight:800;">S/ ${(f.deuda || 0).toFixed(2)}</td>
          <td>${f.fecha || '—'}</td>
          <td><span class="badge-pendiente">Pendiente</span></td>
          <td>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-success fw-bold"
                onclick="marcarPagado(${f.id || f.fiadoId},'${(f.nombre || '').replace(/'/g, "\\'")}',${f.deuda || 0})">
                <i class="fa-solid fa-check me-1"></i>Pagado
              </button>
              <button class="btn btn-sm btn-outline-danger fw-bold"
                onclick="confirmarEliminar('fiado',${f.id || f.fiadoId},'${(f.nombre || '').replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-trash me-1"></i>Eliminar
              </button>
            </div>
          </td>
        </tr>`;
    });
  } catch (error) {
    console.error('Error cargando fiados:', error);
    document.getElementById('table-fiados').innerHTML = 
      `<tr><td colspan="6" class="text-center py-3 text-danger fw-bold">Error al conectar con el servidor</td></tr>`;
  }
}

function abrirModalFiado() {
  document.getElementById('modalFiadoTitulo').textContent = 'Nuevo Fiado';
  document.getElementById('fiado-id').value = '';
  document.getElementById('fiado-nombre').value = '';
  document.getElementById('fiado-deuda').value = '';
  document.getElementById('fiado-fecha').value = new Date().toISOString().split('T')[0];
  document.getElementById('fiado-error').style.display = 'none';
  new bootstrap.Modal(document.getElementById('modalFiado')).show();
}

async function guardarFiado() {
  const err = document.getElementById('fiado-error');
  const nombre = document.getElementById('fiado-nombre').value.trim();
  const deuda = parseFloat(document.getElementById('fiado-deuda').value);
  const fechaRaw = document.getElementById('fiado-fecha').value;

  if (!nombre) {
    err.textContent = 'El nombre del cliente es obligatorio.';
    err.style.display = 'block';
    return;
  }
  
  if (isNaN(deuda) || deuda <= 0) {
    err.textContent = 'La deuda debe ser mayor a 0.';
    err.style.display = 'block';
    return;
  }
  
  if (!fechaRaw) {
    err.textContent = 'Selecciona una fecha.';
    err.style.display = 'block';
    return;
  }
  
  err.style.display = 'none';

  const partes = fechaRaw.split('-');
  const fecha = `${partes[2]}/${partes[1]}/${partes[0]}`;

  try {
    const response = await fetch(`${API}/fiados`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        nombre: nombre,
        deuda: deuda, 
        fecha: fecha, 
        estado: 'Pendiente' 
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Error ${response.status}`);
    }
    
    bootstrap.Modal.getInstance(document.getElementById('modalFiado')).hide();
    await cargarFiados();
    alert('✅ Fiado registrado correctamente');
    
  } catch (error) {
    console.error('Error guardando fiado:', error);
    err.textContent = `Error al guardar: ${error.message}`;
    err.style.display = 'block';
  }
}

async function marcarPagado(id, nombre, deuda) {
  if (!confirm(`¿Confirmar pago de ${nombre} por S/ ${deuda.toFixed(2)}?\nSe registrará en el historial.`)) return;

  try {
    const response = await fetch(`${API}/fiados/${id}/pagar`, { method: 'PATCH' });
    if (!response.ok) throw new Error(`Error ${response.status}`);
    
    await cargarFiados();
    
    if (document.getElementById('page-historial').classList.contains('activa')) {
      await cargarHistorial();
    }
    
    alert('✅ Pago registrado correctamente');
    
  } catch (error) {
    console.error('Error registrando pago:', error);
    alert('Error al registrar el pago. Verifica la conexión.');
  }
}
// ════════════════════════════════════════
//  HISTORIAL DE PAGOS
// ════════════════════════════════════════
async function cargarHistorial() {
  try {
    const response = await fetch(`${API}/historial`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    
    const wrap = document.getElementById('historial-list');
    wrap.innerHTML = '';

    if (!data || data.length === 0) {
      wrap.innerHTML = `
        <div class="text-center py-5" style="color:var(--muted);">
          <i class="fa-solid fa-clock fa-2x mb-3" style="opacity:0.3;"></i>
          <p style="font-weight:700;">Aún no hay pagos registrados</p>
        </div>`;
      return;
    }

    const historialOrdenado = [...data].reverse();
    
    historialOrdenado.forEach(h => {
      const nombreCliente = h.nombre || 'Cliente';
      const iniciales = nombreCliente.split(' ')
        .slice(0, 2)
        .map(p => p[0])
        .join('')
        .toUpperCase() || 'CL';
      
      wrap.innerHTML += `
        <div class="historial-item">
          <div class="historial-avatar">${iniciales}</div>
          <div class="historial-info">
            <div class="historial-nombre">${nombreCliente}</div>
            <div class="historial-fecha">
              <i class="fa-solid fa-calendar-check" style="color:var(--lime-dark);font-size:0.7rem;"></i>
              Fiado: ${h.fechaFiado || '—'} &nbsp;→&nbsp;
              <i class="fa-solid fa-check-circle" style="color:var(--lime-dark);font-size:0.7rem;"></i>
              Pagado: ${h.fechaPago || '—'}
            </div>
          </div>
          <div class="historial-monto">S/ ${(h.deuda || 0).toFixed(2)}</div>
        </div>`;
    });
  } catch (error) {
    console.error('Error cargando historial:', error);
    document.getElementById('historial-list').innerHTML = `
      <div class="text-center py-5 text-danger">
        <i class="fa-solid fa-circle-exclamation fa-2x mb-3"></i>
        <p>Error al cargar el historial</p>
      </div>`;
  }
}

// ════════════════════════════════════════
//  ELIMINAR UNIVERSAL
// ════════════════════════════════════════
function confirmarEliminar(tipo, id, descripcion) {
  if (!id) {
    alert('Error: ID no válido');
    return;
  }
  
  document.getElementById('eliminar-desc').textContent = `Se eliminará: "${descripcion || 'Registro'}"`;
  const btn = document.getElementById('btn-confirmar-eliminar');
  
  btn.onclick = async () => {
    const endpoints = {
      cliente: 'clientes',
      stock: 'stock',
      venta: 'ventas',
      fiado: 'fiados'
    };
    
    const endpoint = endpoints[tipo];
    if (!endpoint) {
      alert('Tipo de registro no válido');
      return;
    }
    
    try {
      const response = await fetch(`${API}/${endpoint}/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        let errorMessage = `Error ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) errorMessage = errorText;
        } catch(e) {}
        throw new Error(errorMessage);
      }
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('modalEliminar'));
      if (modal) modal.hide();
      
      if (tipo === 'cliente') await cargarClientes();
      if (tipo === 'stock') await cargarStock();
      if (tipo === 'venta') {
        await cargarVentas();
        await cargarStock();
      }
      if (tipo === 'fiado') await cargarFiados();
      
      alert('✅ Registro eliminado correctamente');
      
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert(`Error al eliminar: ${error.message}`);
    }
  };
  
  new bootstrap.Modal(document.getElementById('modalEliminar')).show();
}
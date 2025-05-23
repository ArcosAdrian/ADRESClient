

const API_URL = 'http://localhost:5107/Adres/';
let originales = [];

toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": false,
  "progressBar": false,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "500",
  "timeOut": "5000",
  "extendedTimeOut": "500",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

function renderizarTabla(adquisiciones) {
    const tbody = $('#tablaAdquisiciones tbody');
    tbody.empty();

    adquisiciones.forEach(adquisicion => {
        const fila = $(`
          <tr>
            <td>${adquisicion.proveedorNombre}</td>
            <td>${adquisicion.servicioNombre}</td>
            <td>${adquisicion.unidadNombre}</td>
            <td>${adquisicion.presupuesto}</td>
            <td>${adquisicion.cantidad}</td>
            <td>${adquisicion.valorUnitario}</td>
            <td>${adquisicion.fechaAdquisicion}</td>
            <td>${adquisicion.comentario}</td>
            <td>
              <button class="btn-editar"  data-id="${adquisicion.id}">Editar</button>
              <button class="btn-eliminar" data-id="${adquisicion.id}">Eliminar</button>
              <button class="btn-historia" data-id="${adquisicion.id}">Ver Historico</button>
            </td>
          </tr>
        `);
        tbody.append(fila);
    });
}

function cargarAdquisiciones() {
    $.get(API_URL + 'Adquisicion/', function (adquisiciones) {
        originales = adquisiciones;
        renderizarTabla(adquisiciones);
    }).fail(function () {
        toastr.error('Error al cargar las opciones para Adquisiciones');
    });
};

function cargarProveedores() {
    $.get(API_URL + 'Util/Proveedores/', function (data) {
        const select = $('#accionProveedor');
        data.forEach(item => {
            select.append(`<option value="${item.id}">${item.nombre}</option>`);
        });
        select.prop('selectedIndex', -1);
    }).fail(function () {
        toastr.error('Error al cargar las opciones de Proveedores');
    });
}

function cargarServicios() {
    $.get(API_URL + 'Util/Servicios/', function (data) {
        const select = $('#accionServicio');
        data.forEach(item => {
            select.append(`<option value="${item.id}">${item.nombre}</option>`);
        });
        select.prop('selectedIndex', -1);

    }).fail(function () {
        toastr.error('Error al cargar las opciones de Servicios');
    });
}

function cargarUnidades() {
    $.get(API_URL + 'Util/Unidades/', function (data) {
        const select = $('#accionUnidad');
        data.forEach(item => {
            select.append(`<option value="${item.id}">${item.nombre}</option>`);
        });
        select.prop('selectedIndex', -1);
    }).fail(function () {
        toastr.error('Error al cargar las opciones de Unidades');
    });
}

function incializarModalAccion(data) {
    $('#accionId').val(data.id);
    $('#accionProveedor').val(data.proveedorId);
    $('#accionServicio').val(data.servicioId);
    $('#accionUnidad').val(data.unidadId);
    $('#accionPresupuesto').val(data.presupuesto);
    $('#accionCantidad').val(data.cantidad);
    $('#accionValor').val(data.valorUnitario);
    $('#accionFecha').val(data.fechaAdquisicion);
    $('#accionComentario').val(data.comentario);

    $('#modalAccion').fadeIn();
}

function validarDataItem(atributo, valor) {
    if (!valor || valor.trim() === '') {
        toastr.warning(`El campo <b>${atributo}</b> es obligatorio.`);
        return false;
    }
    return true;

}
function validarData(data) {
    // S debe determinar que alores son obligatorios
    if (!validarDataItem('Proveedor', data.proveedorId)) return false;
    if (!validarDataItem('Servicio', data.servicioId)) return false;
    if (!validarDataItem('Unidad', data.unidadId)) return false;
    if (!validarDataItem('Presupuesto', data.presupuesto)) return false;
    if (!validarDataItem('Cantidad', data.cantidad)) return false;
    if (!validarDataItem('Valor Unitario', data.valorUnitario)) return false;
    if (!validarDataItem('Fecha Adquisicion', data.fechaAdquisicion)) return false;
    //if (!validarDataItem('Comentario', data.comentario)) return false;

    return true;
}
function gardarAccion() {


    const id = $('#accionId').val();
    const proveedorId = $('#accionProveedor').val();
    const servicioId = $('#accionServicio').val();
    const unidadId = $('#accionUnidad').val();
    const presupuesto = $('#accionPresupuesto').val();
    const cantidad = $('#accionCantidad').val();
    const valorUnitario = $('#accionValor').val();
    const fechaAdquisicion = $('#accionFecha').val();
    const comentario = $('#accionComentario').val();

    let idValue = id ? parseInt(id, 10) : null;
    //debugger;
    var data = { id: idValue, proveedorId, servicioId, unidadId, presupuesto, cantidad, valorUnitario, fechaAdquisicion, comentario };
    if (validarData(data) == false) {
        return;
    }
    const metodo = idValue ? 'PUT' : 'POST';
    const url = idValue ? `${API_URL}Adquisicion/${id}` : `${API_URL}Adquisicion/`;

    $.ajax({
        url: url,
        method: metodo,
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function () {
            $('#modalAccion').fadeOut();
            cargarAdquisiciones();
            toastr.success(`Adquisicion ${id ? 'actualizada' : 'creada'} correctamente.`);
        },
        error: function () {
            toastr.error('Ocurrió un error al guardar');
        }
    });
}

function renderizarTablaHistoria(adquisiciones) {
    const tbody = $('#tablaHistoria tbody');
    tbody.empty();
    let index = 1;
    adquisiciones.forEach(adquisicion => {
        const fila = $(`
          <tr>
           <td>${index}</td>  
           <td>${adquisicion.usuarioCambio}</td>
            <td>${adquisicion.fechaCambio}</td>
            <td>${adquisicion.tipoCambio}</td>
            <td>${adquisicion.cambios}</td>
            
            <td>
              <button class="btn-historia-datos" data-id="${adquisicion.id}">Ver Registro Ant.</button>
            </td>
          </tr>
        `);
        tbody.append(fila);
        index++;
    });
}


$(document).ready(function () {
    cargarAdquisiciones();
    cargarProveedores();
    cargarUnidades();
    cargarServicios();

    $('#btnAdicionar').click(function () {
        $('#modalTitulo').text('Adiconar Adquisicion');
        incializarModalAccion({ id: null, proveedorId: '', servicioId: '', unidadId: '', presupuesto: '', cantidad: '', valorUnitario: '', fechaAdquisicion: '', comentario: '' });
        $('#modalAccion').fadeIn();
    });

    $('#tablaAdquisiciones').on('click', '.btn-editar', function () {
        $('#modalTitulo').text('Editar Adquisicion');
        const id = $(this).data('id');
        var aqduisicion = originales.find(x => x.id == id);
        if (!aqduisicion) {
            toastr.error('No se encontró la adquisicion.');
            return;
        }
        incializarModalAccion(aqduisicion);
        $('#modalAccion').fadeIn();
    });

    $('#btnModalGuardar').click(function () {
        gardarAccion();
    });

    $('#tablaAdquisiciones').on('click', '.btn-eliminar', function () {
        const id = $(this).data('id');
        if (!confirm('¿Está seguro de eliminar la Adquisicion?')) return;

        $.ajax({
            url: `${API_URL}Adquisicion/${id}`,
            method: 'DELETE',
            success: function () {
                cargarAdquisiciones();
                toastr.success('Adquisicion eliminado correctamente.');
            },
            error: function () {
                toastr.error('Error al eliminar la Adquisicion.');
            }
        });
    });

    $('#tablaAdquisiciones').on('click', '.btn-historia', function () {
        const id = $(this).data('id');

        $.get(`${API_URL}Adquisicion/Historia/${id}`, function (adquisiciones) {
            //debugger
            renderizarTablaHistoria(adquisiciones);
            $('#modalHistoria').fadeIn();
        });
    });


    $('#btnModalCancelar').click(function () {
        $('#modalAccion').fadeOut();
    });

    $('#btnModalHistoriaCerrar').click(function () {
        $('#modalHistoria').fadeOut();
    });



    $('#filtro').on('input', function () {
        const texto = $(this).val().toLowerCase();
        debugger
        const filtrados = originales.filter(u =>
            u.proveedorNombre.toLowerCase().includes(texto) || u.servicioNombre.toLowerCase().includes(texto)
        );
        renderizarTabla(filtrados);
    });
});
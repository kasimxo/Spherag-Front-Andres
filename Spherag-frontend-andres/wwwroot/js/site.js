$(document).ready(function () {

    createGraph("Acumulado", "24 H");

    $('#graph-time-intervals').children().each(function (index) {
        $(this).on('click', (btn) => {
            let tipo = $('#tipo-grafico')[0].value
            createGraph(tipo, this.innerText)
            $('#graph-time-intervals > .active').removeClass('active')
            $(this).addClass('active')
        })
    })

    //TO-DO: change chart type
    $('#tipo-grafico').on('change', (e) => {
        let interval = $('#graph-time-intervals > .active')[0].innerText
        console.log('org interval', interval, $('#graph-time-intervals > .active')[0])
        //Como el value debería ser el index del boton, igual nos renta mas tirar simplemente por texto
        createGraph(e.target.value, interval)
    })
});

/**
 * 
 * Function to change time interval in selected graph
 * 0 for 24 hours
 * 1 for 48 hours
 * 2 for 7 days
 * 3 for 30 days
 * 4 for custom time frame (open calendar)
 * @param {any} selector
 */
function changeGraphInterval(selector) {

    //let dataSource = $('#devexpress-container').dxChart('getDataSource');
    //dataSource.filter(['timestamp', '<', selector * selector+5]);
    //dataSource.load();
}

/**
 * Creates the graph in the page for the specified type and time interval
 * Every time we want to change anything about the graph, this method is called
 * @param {any} type
 * @param {any} interval
 */
async function createGraph(type, interval) {
    let data;
    let logs;
    let dataRaw;
    let start = calculateStart(interval);
    let end = new Date()-0;
    //the only time end is not now, is if its a custom interval
    switch (type) {
        case 'Acumulado':
            dataRaw = await getDataAcumulado(start, end);
            console.log(dataRaw)
            data = dataRaw.accumulatedFlowData.data;
            logs = dataRaw.accumulatedFlowData.logs;
            break;
        case 'Caudal':
            dataRaw = await getDataCaudal(start, end);
            data = dataRaw.flowRateData.data;
            logs = dataRaw.flowRateData.logs;
            break;
    }
    $('#devexpress-container').dxChart({
        dataSource: data,
        series: {
            argumentField: 'dateTS',
            valueField: 'value',
            name: 'Acumulado',
            border: {
                color: 'blue',
                width: 3,
                visible: true
            }
        },
        legend: {
            itemTextPosition: 'right',
            position: "outside",
            horizontalAlignment: "center",
            verticalAlignment: "bottom"
        },
        argumentAxis: {
            label: {
                format: function (value) {
                    return new Date(value ).toLocaleTimeString(navigator.language, {hour:'2-digit', minute:'2-digit'});
                }
            }
        },
        commonSeriesSettings: {
            type: 'area'
        }
    });

    let table = $('#logs-table > tbody')
    table.empty()
    logs.forEach((el, index) => {
        let icon 
        let msg = infoMsg(el.resultAction)
        let data = el.data.value ? el.data.value : '';
        let date = new Date(el.dateTS);
        let days = date.toLocaleDateString();
        let hours = date.getUTCHours().toString().padStart(2, '0');
        let mins = date.getUTCMinutes().toString().padStart(2, '0');
        let secs = date.getUTCSeconds().toString().padStart(2, '0');
        if (!!el.origin) {
            icon = '<i class="bi bi-person py-1 text-secondary"></i>';
        }
        table.append('<tr><td>' + icon + '</td><td>' + msg + '</td><td>' + data + '</td><td>' + days + '<br />' + hours + ':' + mins + ':' + secs + '</td></tr>')
    })
    
}

function infoMsg(resultAction) {
    let actions = [
        "Ninguno",
        "Eliminación",
        "Creación",
        "Edición",
        "Clonación",
        "Cambio modo energía a tiempo real",
        "Cambio modo energía a eco",
        "Cambio modo energía a reposo",
        "En reposo",
        "Despertar",
        "Creación de elemento",
        "Eliminación de elemento",
        "Edición de elemento",
        "Apertura manual",
        "Apertura automática",
        "Cierre manual",
        "Cierre automático",
        "Cambio de modo a automático",
        "Cambio de modo a manual",
        "Actualización de valor",
        "Crear alarma",
        "Editar alarma",
        "Eliminar alarma",
        "Disparar alarma"
    ];
    return actions[resultAction];
}

async function getDataAcumulado(start, end) {
    console.log("start: ",start,"end: ", end);
    let data = await $.ajax({
        url: '/Home/GetDataAcumulado',
        type: 'GET',
        data: {start:start, end:end},
        success: function (response) {},
        error: function (xhr, status, error) {
            console.error('Error: ' + error)
        }
    });
    return data;
}
async function getDataCaudal(start, end) {
    console.log(start,end);
    let data = await $.ajax({
        url: '/Home/GetDataCaudal',
        type: 'GET',
        data: { start: start, end: end },
        success: function (response) {},
        error: function (xhr, status, error) {
            console.error('Error: ' + error)
        }
    });
    return data;
}

function calculateStart(interval) {
    console.log('calculateStart interval: ', interval)
    /*
    0 for 24 hours
    * 1 for 48 hours
    * 2 for 7 days
    * 3 for 30 days
    * 4 for custom time frame(open calendar)
    * */
    switch (interval) {
        case "24 H":
            return new Date() - 24 * 3600 * 1000
        case "48 H":
            return new Date() - 48 * 3600 * 1000
        case "7 D":
            return new Date() - 24 * 3600 * 1000 * 7
        case "30 D":
            return new Date() - 24 * 3600 * 1000 * 30
        case "Cal":
        default:
            return null;
    }
}
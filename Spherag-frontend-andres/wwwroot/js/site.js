
$(document).ready(function () {

    $('#btn-custom-date-range').on('click', (e) => {
        
    });

    createGraph("Acumulado", "24 H");

    $('#graph-time-intervals').children().each(function (index) {
        $(this).on('click', (btn) => {
            if (index !== 4) {
                let tipo = $('#tipo-grafico')[0].value
                createGraph(tipo, this.innerText)
                $('#graph-time-intervals > .active').removeClass('active')
                let container = $('#date-selection-container');
                container.removeClass('d-flex');
                container.addClass('d-none');
                $(this).addClass('active')
            } else {
                $('#graph-time-intervals > .active').removeClass('active');
                $(this).addClass('active');
                datePickerFrom();
            }
        })
    })

    $('#btn-refresh-data').on('click', (e) => {
        let type = $('#tipo-grafico')[0].value
        let interval = $('#graph-time-intervals > .active')[0].innerText
        createGraph(type, interval);
    });

    //TO-DO: change chart type
    $('#tipo-grafico').on('change', (e) => {
        let interval = $('#graph-time-intervals > .active')[0].innerText
        console.log('org interval', interval, $('#graph-time-intervals > .active')[0])
        //Como el value debería ser el index del boton, igual nos renta mas tirar simplemente por texto
        createGraph(e.target.value, interval)
    })
});


/**
 * Creates the graph in the page for the specified type and time interval
 * Every time we want to change anything about the graph, this method is called
 * @param {any} type
 * @param {any} interval
 */

function datePickerFrom() {
    let from = 0;
    let to;
    let label = $("#date-selection-label");
    let container = $('#date-selection-container');
    let datepicker = $('#date-selection');
    container.removeClass('d-none');
    container.addClass('d-flex');
    label.text("Fecha desde");
    datepicker.dxCalendar({
        min: from,
        max: new Date(),
        onValueChanged: function (e) {
            if (from === 0) {
                from = e.value.getTime();
                label.text("Fecha hasta");
                console.log(from, e)
                datepicker.dxCalendar('instance').option('min', from);
            } else {
                let type = $('#tipo-grafico')[0].value;
                createCustomGraph(type, from, e.value.getTime())
                datepicker.dxCalendar('dispose');
                container.removeClass('d-flex');
                container.addClass('d-none');
            }
            return;
        }
    });
    console.log('Creado date range ', from)
}

async function createCustomGraph(type, start, end) {
    console.log('Creadon custom graph', start, end)
    let data;
    let logs;
    let dataRaw;

    switch (type) {
        case 'Acumulado':
            dataRaw = await getDataAcumulado(start, end);
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
        valueAxis: {
            label: {
                customizeText: function (info) {
                    return info.value + " m&sup3;";
                }
            }
        },
        argumentAxis: {
            label: {
                format: function (value) {
                    return new Date(value).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
                }
            }
        },
        commonSeriesSettings: {
            type: 'area'
        }
    });

    let table = $('#logs-table > tbody')
    table.empty()
    if (logs !== undefined) {
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
            table.append('<tr><td>' + icon + '</td><td class="text-start">' + msg + '</td><td>' + data + '</td><td class="text-end">' + days + '<br />' + hours + ':' + mins + ':' + secs + '</td></tr>')
        })
    }
}

async function createGraph(type, interval) {
    let data;
    let logs;
    let dataRaw;
    let start = calculateStart(interval);
    let end = new Date() - 0;
    let gmt;
    let battery;
    let signal;
    let lastUpdatedDate;
    //the only time end is not now, is if its a custom interval
    
    switch (type) {
        case 'Acumulado':
            dataRaw = await getDataAcumulado(start, end);
            data = dataRaw.accumulatedFlowData.data;
            logs = dataRaw.accumulatedFlowData.logs;
            gmt = dataRaw.gmt;
            lastUpdatedDate = dataRaw.lastUpdatedDate;
            battery = dataRaw.batteryPercentage;
            signal = dataRaw.signalPercentage;
            break;
        case 'Caudal':
            dataRaw = await getDataCaudal(start, end);
            data = dataRaw.flowRateData.data;
            logs = dataRaw.flowRateData.logs;
            gmt = dataRaw.gmt;
            lastUpdatedDate = dataRaw.lastUpdatedDate;
            battery = dataRaw.batteryPercentage;
            signal = dataRaw.signalPercentage;
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
        valueAxis: {
            label: {
                customizeText: function (info) {
                    return info.value + " m&sup3;";
                }
            }
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
    if (logs !== undefined) {
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
            table.append('<tr><td>' + icon + '</td><td class="text-start">' + msg + '</td><td>' + data + '</td><td class="text-end">' + days + '<br />' + hours + ':' + mins + ':' + secs + '</td></tr>')
        })
    }
    let batteryIcon;
    if (battery > 80) {
        batteryIcon = '<i class="bi bi-battery-full"></i> '
    } else if (battery < 20) {
        batteryIcon = '<i class="bi bi-battery"></i> '
    } else {
        batteryIcon = '<i class="bi bi-battery-half"></i> '
    }

    let signalIcon;
    if (signal > 80) {
        signalIcon = '% <i class="bi bi-reception-4"></i>'
    } else if (signal > 60) {
        signalIcon = '% <i class="bi bi-reception-3"></i>'
    } else if (signal > 40) {
        signalIcon = '% <i class="bi bi-reception-2"></i>'
    } else if (signal > 20) {
        signalIcon = '% <i class="bi bi-reception-1"></i>'
    } else {
        signalIcon = '% <i class="bi bi-reception-0"></i>'
    }
    $('#battery-signal').html(batteryIcon + battery + signalIcon);
    console.log($('#battery-signal'))
    $('#text-last-connection').html('<b>Última conexión:</b> ' + new Date(lastUpdatedDate).toLocaleString('es-ES') + '<br/><i class="bi bi-globe-americas"></i> GMT Finca: ' + gmt +'</p>');
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
        success: function (response) {
            console.log('Petición exitosa: '+start,end,response)
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error + " Estado: " + status)
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
        success: function (response) {
            console.log('Exito caudal ', response)
        },
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
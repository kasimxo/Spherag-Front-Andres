var logs;
var logsIndex = 0;
$(document).ready(function () {

    createGraph("Acumulado", "24 H");

    $("#btn-next-logs").on('click', () => { navigateLogs(-1)})
    $("#btn-prev-logs").on('click', () => { navigateLogs(+1)})
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

    $('#tipo-grafico').on('change', (e) => {
        let interval = $('#graph-time-intervals > .active')[0].innerText
        createGraph(e.target.value, interval)
    })
});


function datePickerFrom() {
    let from = 0;
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
}

async function createCustomGraph(type, start, end) {
    let data;
    let logs;
    let dataRaw;

    switch (type) {
        case 'Acumulado':
            dataRaw = await getData(2, start, end);
            data = dataRaw.accumulatedFlowData.data;
            logs = dataRaw.accumulatedFlowData.logs;
            break;
        case 'Caudal':
            dataRaw = await getData(2, start, end);
            data = dataRaw.flowRateData.data;
            logs = dataRaw.flowRateData.logs;
            break;
    }

    drawGraph(data);
    logsIndex = 0;
    fillLogs(logs);

    let batteryIcon = getBatteryIcon(battery);
    let signalIcon = getSignalIcon(signal);

    $('#battery-signal').html(batteryIcon + battery + signalIcon);
    $('#text-last-connection').html('<b>Última conexión:</b> ' + new Date(lastUpdatedDate).toLocaleString('es-ES') + '<br/><i class="bi bi-globe-americas"></i> GMT Finca: ' + gmt + '</p>');

}

async function createGraph(type, interval) {
    let data;
    let logsRaw;
    let dataRaw;
    let start = calculateStart(interval);
    let end = new Date() - 0;

    switch (type) {
        case 'Acumulado':
            dataRaw = await getData(2, start, end);
            data = dataRaw.accumulatedFlowData.data;
            logsRaw = dataRaw.accumulatedFlowData.logs;
            break;
        case 'Caudal':
            dataRaw = await getData(1, start, end);
            data = dataRaw.flowRateData.data;
            logsRaw = dataRaw.flowRateData.logs;
            break;
    }

    let gmt = dataRaw.gmt;
    let lastUpdatedDate = dataRaw.lastUpdatedDate;
    let battery = dataRaw.batteryPercentage;
    let signal = dataRaw.signalPercentage;

    drawGraph(data)
    logsIndex = 0;
    fillLogs(logsRaw)

    let batteryIcon = getBatteryIcon(battery);
    let signalIcon = getSignalIcon(signal);

    $('#battery-signal').html(batteryIcon + battery + signalIcon);
    $('#text-last-connection').html('<b>Última conexión:</b> ' + new Date(lastUpdatedDate).toLocaleString('es-ES') + '<br/><i class="bi bi-globe-americas"></i> GMT Finca: ' + gmt + '</p>');
}

function drawGraph(data) {
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
}
function navigateLogs(num) {
    logsIndex += num * 5
    if (logsIndex < 0) {
        logsIndex = 0;
    }
    if (logsIndex > logs.length) {
        logsIndex -= 5;
    }
    let table = $('#logs-table > tbody')
    table.empty()
    if (logs !== undefined) {

        for (let i = logsIndex; i < logsIndex + 5; i++) {
            let log = logs[i]
            let icon
            let msg = infoMsg(log.resultAction)
            let data = log.data.value ? log.data.value : '';
            let date = new Date(log.dateTS);
            let days = date.toLocaleDateString();
            let hours = date.getUTCHours().toString().padStart(2, '0');
            let mins = date.getUTCMinutes().toString().padStart(2, '0');
            let secs = date.getUTCSeconds().toString().padStart(2, '0');
            if (!!log.origin) {
                icon = '<i class="bi bi-person py-1 text-secondary"></i>';
            }
            table.append('<tr><td>' + icon + '</td><td class="text-start">' + msg + '</td><td>' + data + '</td><td class="text-end p-0">' + days + '<br />' + hours + ':' + mins + ':' + secs + '</td></tr>')
        }
    }
}
function fillLogs(logsRaw) {
    logs = logsRaw
    let table = $('#logs-table > tbody')
    table.empty()
    if (logs !== undefined) {

        for (let i = logsIndex; i < logsIndex + 5; i++) {
            let log = logs[i]
            let icon
            let msg = infoMsg(log.resultAction)
            let data = log.data.value ? log.data.value : '';
            let date = new Date(log.dateTS);
            let days = date.toLocaleDateString();
            let hours = date.getUTCHours().toString().padStart(2, '0');
            let mins = date.getUTCMinutes().toString().padStart(2, '0');
            let secs = date.getUTCSeconds().toString().padStart(2, '0');
            if (!!log.origin) {
                icon = '<i class="bi bi-person py-1 text-secondary"></i>';
            }
            table.append('<tr><td>' + icon + '</td><td class="text-start">' + msg + '</td><td>' + data + '</td><td class="text-end p-0">' + days + '<br />' + hours + ':' + mins + ':' + secs + '</td></tr>')
        }
    }

}


function getBatteryIcon(battery) {
    if (battery > 80) {
        return '<i class="bi bi-battery-full"></i> '
    } else if (battery < 20) {
        return '<i class="bi bi-battery"></i> '
    } else {
        return '<i class="bi bi-battery-half"></i> '
    }
}

function getSignalIcon(signal) {
    if (signal > 80) {
        return '% <i class="bi bi-reception-4"></i>'
    } else if (signal > 60) {
        return '% <i class="bi bi-reception-3"></i>'
    } else if (signal > 40) {
        return '% <i class="bi bi-reception-2"></i>'
    } else if (signal > 20) {
        return '% <i class="bi bi-reception-1"></i>'
    } else {
        return '% <i class="bi bi-reception-0"></i>'
    }
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

async function getData(type, start, end) {
    console.log("start: ",start,"end: ", end);
    let data = await $.ajax({
        url: '/Home/GetData',
        type: 'GET',
        data: {type: type, start:start, end:end},
        success: function (response) {
            console.log('Petición exitosa: '+start,end,response)
        },
        error: function (xhr, status, error) {
            console.error('Error: ' + error + " Estado: " + status)
        }
    });
    return data;
}

function calculateStart(interval) {
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
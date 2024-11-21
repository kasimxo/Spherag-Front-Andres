$(document).ready(function () {

    createGraph("Acumulado", 0);

    $('#graph-time-intervals').children().each(function (index) {
        $(this).on('click', (btn) => {
            changeGraphInterval(index)
            $('#graph-time-intervals > .active').removeClass('active')
            $(this).addClass('active')
        })
    })

    //TO-DO: change chart type
    $('#tipo-grafico').on('change', (e) => {
        let interval = $('#graph-time-intervals > .active')[0].value
        console.log('org interval', interval, $('#graph-time-intervals > .active')[0])
        //Como el value debería ser el index del boton, igual nos renta mas tirar simplemente por texto
        createGraph(e.target.value, interval)
    })
    //Ejemplo de petición ajax al controlador
    $('#btn-test-api').on('click', function () {
        $.ajax({
            url: '/Home/GetDataAcumulado',
            type: 'GET',
            success: function (response) {
                console.log(response)
                
            },
            error: function (xhr, status, error) {
                console.error('Error: ' + error)

            }
        })
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
    let dataRaw;
    let start = calculateStart(interval);
    let end = new Date();
    //the only time end is not now, is if its a custom interval
    switch (type) {
        case 'Acumulado':
            dataRaw = await getDataAcumulado(start, end);
            console.log(dataRaw)
            data = dataRaw.accumulatedFlowData.data;
            break;
        case 'Caudal':
            dataRaw = await getDataCaudal(start, end);
            data = dataRaw.flowRateData.data;
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
}


async function getDataAcumulado(start, end) {
    console.log(start, end);
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
        case 0:
            return new Date() - 24 * 3600 * 1000
        case 1:
            return new Date() - 48 * 3600 * 1000
        case 2:
            return new Date() - 24 * 3600 * 1000 * 7
        case 3:
            return new Date() - 24 * 3600 * 1000 * 30
        case 4:
        default:
            return null;
    }
}
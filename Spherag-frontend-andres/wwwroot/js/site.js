const dataAcumulado = [
    { timestamp: 1, value: 35 },
    { timestamp: 2, value: 75 },
    { timestamp: 3, value: 72 },
    { timestamp: 4, value: 42 },
    { timestamp: 5, value: 38 },
    { timestamp: 6, value: 22 },
    { timestamp: 7, value: 25 },
    { timestamp: 8, value: 65 },
    { timestamp: 9, value: 62 },
    { timestamp: 10, value: 52 },
    { timestamp: 11, value: 30 },
    { timestamp: 12, value: 38 },
    { timestamp: 13, value: 35 },
    { timestamp: 14, value: 64 },
    { timestamp: 15, value: 63 },
    { timestamp: 16, value: 72 },
    { timestamp: 17, value: 68 },
    { timestamp: 18, value: 82 },
    { timestamp: 19, value: 70 },
    { timestamp: 20, value: 61 },
    { timestamp: 21, value: 55 },
    { timestamp: 22, value: 52 },
    { timestamp: 23, value: 49 },
    { timestamp: 24, value: 50 }
]

const dataCaudal = [
    { timestamp: 1, value: 3 },
    { timestamp: 2, value: 5 },
    { timestamp: 3, value: 2 },
    { timestamp: 4, value: 2 },
    { timestamp: 5, value: 8 },
    { timestamp: 6, value: 2 },
    { timestamp: 7, value: 5 },
    { timestamp: 8, value: 5 },
    { timestamp: 9, value: 2 },
    { timestamp: 10, value: 2 },
    { timestamp: 11, value: 0 },
    { timestamp: 12, value: 8 }
]



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
    $('#tipo-grafico').on('change', (e) => { createGraph(e.target.value,0) })
    //Ejemplo de petición ajax al controlador
    $('#debug-btn').on('click', function () {
        $.ajax({
            url: '/Home/DoSomething',
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

    let dataSource = $('#devexpress-container').dxChart('getDataSource');
    dataSource.filter(['timestamp', '<', selector * selector+5]);
    dataSource.load();
}

/**
 * Creates the graph in the page for the specified type and time interval
 * Every time we want to change anything about the graph, this method is called
 * @param {any} type
 * @param {any} interval
 */
function createGraph(type, interval) {
    let data
    switch (type) {
        case 'Acumulado':
            data = dataAcumulado;
            break;
        case 'Caudal':
            data = dataCaudal;
            break;
    }
    $('#devexpress-container').dxChart({
        dataSource: data,
        series: {
            argumentField: 'timestamp',
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
        commonSeriesSettings: {
            type: 'area'
        }
    });
}

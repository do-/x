$_DRAW.ssh_command_items = async function (data) {

    $(w2_waiting_panel ()).w2regrid ({
    
        name: 'ssh_command_items_grid',             
        
        show: {
            toolbar: true,
            footer: true,
//            toolbarAdd: true,
        },            

        columns: [                
            {field: 'host',           caption: 'Host',    size: 100},
            {field: 'ts_from',        caption: 'Начало',    size: 28, render: _ts},
            {field: 'ts_conn',        caption: 'Соединение',    size: 28, render: _ts},
            {field: 'ts_to',          caption: 'Окончание',    size: 28, render: _ts},
            {field: 'ms_conn',        caption: 'Ожидание, мс',    size: 15, render: 'int'},
            {field: 'ms_exec',        caption: 'Исполнение, мс',    size: 15, render: 'int'},
            {field: 'ms_total',        caption: 'Всего, мс',    size: 15, render: 'int'},
            {field: 'code',           caption: 'Код',    size: 10},
            {field: 'signal',         caption: 'Сигнал',    size: 20},
            {field: 'error',          caption: 'Ошибка',    size: 20},
        ],
                    
        src: data.src,

//        onAdd:      ( ) => show_block ('ssh_command_new'),
        onDblClick: null,

    }).refresh ();
    
}
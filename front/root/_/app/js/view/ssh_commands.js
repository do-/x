$_DRAW.ssh_commands = async function (data) {

    $('title').text ("Команды SSH")

    $('main').w2regrid ({ 
    
        name: 'ssh_commands_grid',             
        
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
        },            
        
        columnGroups : [
            {master: true},
            {master: true},
            {master: true},
            {master: true},
            {span: 4, caption: 'Статистика'},
            {span: 3, caption: 'Проблемы'},
            {span: 2, caption: 'Длительность, мс'},
            {master: true},
        ].filter (not_off),

        columns: [                
            {field: 'ts_created', caption: 'Дата/время', size: 28, render: _ts},
            {field: 'uuid', caption: 'UUID', size: 50, style: 'font-family:courier'},
            {field: 'cmd',        caption: 'Команда',    size: 50},
            {field: 'par',        caption: 'Параллелизм',    size: 10},
            
            {field: 'cnt',        caption: 'hostов',    size: 10, render: 'int'},
            {field: 's_ok',    caption: 'OK',    size: 10, render: 'int'},
            {field: 's_nok',    caption: 'Не OK',    size: 10, render: 'int'},
            {field: '%_ok',    caption: '% OK',    size: 10, render: (r) => Math.floor (100 * r.s_ok / r.cnt) + '%', attr: 'align=right'},
            
            {field: 's_pending',    caption: 'pending',    size: 10, render: 'int'},
            {field: 's_timeout',    caption: 'timeout',    size: 10, render: 'int'},
            {field: 's_error',    caption: 'error',    size: 10, render: 'int'},
            
            {field: 'ms_exec',        caption: 'Исполнение',    size: 10, render: 'int'},
            {field: 'ms_notif',        caption: 'Извещение',    size: 10, render: 'int'},
            
            {field: 'notif_error',        caption: 'Проблема',    size: 50},            
            
        ],
                    
        src: data.src,

        onAdd:      ( ) => show_block ('ssh_command_new'),
        onDblClick: (e) => open_tab   ('/ssh_command/' + e.recid),

    }).refresh ();
    
}
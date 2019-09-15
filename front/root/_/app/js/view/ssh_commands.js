$_DRAW.ssh_commands = async function (data) {

    $('title').text ("Команды SSH")

    $('main').w2regrid ({ 
    
        name: 'ssh_commands_grid',             
        
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
        },            

        columns: [                
            {field: 'ts_created', caption: 'Дата/время', size: 28, render: _ts},
            {field: 'cmd',        caption: 'Команда',    size: 100},
            {field: 'cnt',        caption: 'hostов',    size: 10, render: 'int'},
            {field: 's_pending',    caption: 'pending',    size: 10, render: 'int'},
            {field: 's_ok',    caption: 'ok',    size: 10, render: 'int'},
            {field: 's_timeout',    caption: 'timeout',    size: 10, render: 'int'},
            {field: 's_error',    caption: 'error',    size: 10, render: 'int'},
        ],
                    
        src: data.src,

        onAdd:      ( ) => show_block ('ssh_command_new'),
        onDblClick: (e) => open_tab   ('/ssh_command/' + e.recid),

    }).refresh ();
    
}
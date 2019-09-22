$_DRAW.ssh_command = async function (data) {

    $('title').text (data.cmd)
    
    $('main').html (await to_fill ('ssh_command', data))
    
    $('#totals').w2regrid ({
    
        name: 'ssh_command_totals_grid',             
        
        show: {
            toolbarInput: false,
            toolbar: true,
            footer: false,
//            toolbarAdd: true,
        },            
        
        toolbar: {items: [
        	{
        		type: 'button',
        		caption: 'Отправить извещение',
        		off: data.ts_notif_finish,
        		onClick: $_DO.notify_completion_ssh_command,
        	}
        ].filter (not_off)},

        columns: [                
            {field: 'label',          caption: 'Событие',    size: 40},
            {field: 'ts',             caption: 'Дата/время',    size: 25, render: _ts},
            {field: 'delta',          caption: 'Ожидание, мс',    size: 15, render: 'float:1'},
            {field: 'error',          caption: 'Ошибка',    size: 100},
        ],
        
        records: data.totals
              
    }).refresh ()
    
    var layout = $('#container').w2relayout ({

        name: 'main',

        panels: [
            {type: 'main', size: 400, tabs: [
            	{id: 'ssh_command_items', caption: 'По hostaм'}
            ]},
        ],
                
    })    

}
$_DRAW.ssh_command_items = async function (data) {

    $(w2_waiting_panel ()).w2regrid ({
    
        name: 'ssh_command_items_grid',             
        
        show: {
            toolbar: true,
            footer: true,
//            toolbarAdd: true,
        },            

        columns: [                
            {field: 'ssh_hosts.host',        caption: 'Host',    size: 100},
        ],
                    
        src: data.src,

//        onAdd:      ( ) => show_block ('ssh_command_new'),
        onDblClick: null,

    }).refresh ();
    
}
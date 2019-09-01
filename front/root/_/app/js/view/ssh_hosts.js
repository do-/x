$_DRAW.ssh_hosts = async function (data) {

    $('title').text ("SSH-host'ы")

    $('main').w2regrid ({ 
    
        name: 'ssh_hosts_grid',             
        
        show: {
            toolbar: true,
            footer: true,
            toolbarAdd: true,
        },            

        columns: [                
            {field: 'host',   caption: 'host',    size: 100, sortable: true},
            {field: 'port',   caption: 'порт',    size: 50,  sortable: false},
        ],
                    
        src: data.src,

        onAdd:      ( ) => show_block ('ssh_host_popup'),
        onDblClick: (e) => show_block ('ssh_host_popup', w2_first_grid ().get (e.recid)),

    }).refresh ();
    
}
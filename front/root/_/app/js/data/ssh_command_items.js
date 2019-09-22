////////////////////////////////////////////////////////////////////////////////

$_DO.open_log_ssh_command_items = function (path) {

    window.open ($_SESSION.get ('staticRoot') + '/_ssh_logs/' + path)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_command_items = async function (o) {

    let data = clone ($('body').data ('data'))
            
    data.src = ['ssh_command_items', 
    	{data: {id_command: $_REQUEST.id}}
    ]
            
    return data

}
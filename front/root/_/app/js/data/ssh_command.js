////////////////////////////////////////////////////////////////////////////////

$_DO.run_ssh_command = async function () {

    await response ({type: 'ssh_commands', action: 'run'})
    
    reload_page ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_command = async function (o) {

    let data = await response ({type: 'ssh_commands'})
    
    $('body').data ('data', data)

    return data

}
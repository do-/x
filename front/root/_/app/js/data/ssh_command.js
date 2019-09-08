////////////////////////////////////////////////////////////////////////////////

$_DO.notify_completion_ssh_command = async function () {

    await response ({type: 'ssh_commands', action: 'notify_completion'})
    
    alert ('Извещение отправлено')
    
}

////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_command = async function (o) {

    let data = await response ({type: 'ssh_commands'})
    
    $('body').data ('data', data)

    return data

}
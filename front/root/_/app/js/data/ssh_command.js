////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_command = async function (o) {

    let data = await response ({type: 'ssh_commands'})
    
    $('body').data ('data', data)

    return data

}
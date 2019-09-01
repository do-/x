////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_commands = async function (o) {

    let data = await response ({type: 'ssh_commands', part: 'vocs'})
    
//    add_vocabularies (data, data)
    
    $('body').data ('data', data)
    
    data.src = 'ssh_commands'
            
    return data

}
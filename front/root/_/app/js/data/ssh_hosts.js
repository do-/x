////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_hosts = async function (o) {

    let data = await response ({type: 'ssh_hosts', part: 'vocs'})
    
//    add_vocabularies (data, data)
    
    $('body').data ('data', data)
    
    data.src = 'ssh_hosts'
            
    return data

}
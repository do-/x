////////////////////////////////////////////////////////////////////////////////

$_GET.users = async function (o) {

    let data = await response ({type: 'users', part: 'vocs'})
    
    add_vocabularies (data, {roles: 1})
    
    $('body').data ('data', data)
            
    return data

}
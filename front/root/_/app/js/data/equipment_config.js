////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_config = async function (o) {

    let data = await response ({type: 'equipment_cfg'})
    
    $('body').data ('data', data)
    
    return data

}
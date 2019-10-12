////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_configs = async function (o) {

    let data = {}
        
    $('body').data ('data', data)
    
    data.src = 'equipment_cfg'
            
    return data

}
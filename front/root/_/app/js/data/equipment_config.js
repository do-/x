////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_config = async function (o) {

    let data = await response ({type: 'equipment_cfg'})
    
    data.next_time_label = 'Очередь выключена... Что-то не то'
    
    let dt = data.next_time; if (dt) {
    	data.next_time_label = 'до ' + dt_dmy (dt) + ' ' + dt.substr (11, 12)
    }
    
    $('body').data ('data', data)
    
    return data

}
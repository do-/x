////////////////////////////////////////////////////////////////////////////////

$_DO.cancel_equipment_cfg_schedule = function (e) {
    
    if (confirm ('Отменить несохранённые правки?')) w2_panel_form ().reload_block ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.edit_equipment_cfg_schedule = function (e) {

	$_SESSION.delete ('__read_only')
	
	w2_panel_form ().refresh ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_equipment_cfg_schedule = async function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    let form = w2_popup_form ()
    
    let data = form.values ().actual ().validated ()
    
    data.id = 1

    form.lock ()

    await response ({type: 'equipment_cfg_schedule', action: 'update'}, {data})

    w2popup.close ()
    
    alert ('Значения параметров записаны в БД')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.equipment_cfg_schedule = async function (o) {

    return await response ({type: 'equipment_cfg_schedule', id: 1})

}
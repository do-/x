////////////////////////////////////////////////////////////////////////////////

$_DO.cancel_mfsm_settings = function (e) {
    
    if (confirm ('Отменить несохранённые правки?')) w2_panel_form ().reload_block ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.edit_mfsm_settings = function (e) {

	$_SESSION.delete ('__read_only')
	
	w2_panel_form ().refresh ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_mfsm_settings = async function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    let form = w2_popup_form ()
    
    let data = form.values ().actual ().validated ()
    
    data.id = 1

    form.lock ()

    await response ({type: 'ssh_settings', action: 'update'}, {data})

    w2popup.close ()
    
    alert ('Значения параметров записаны в БД')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.mfsm_settings = async function (o) {

    return await response ({type: 'ssh_settings', id: 1})

}
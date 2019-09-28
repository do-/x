////////////////////////////////////////////////////////////////////////////////

$_DO.cancel_ssh_settings = function (e) {
    
    if (confirm ('Отменить несохранённые правки?')) w2_panel_form ().reload_block ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.edit_ssh_settings = function (e) {

	$_SESSION.delete ('__read_only')
	
	w2_panel_form ().refresh ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_ssh_settings = async function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    let form = w2_panel_form ()
    
    let data = form.values ().actual ().validated ()
    
    data.id = 1

    form.lock ()

    await response ({type: 'ssh_settings', action: 'update'}, {data})

    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_settings = async function (o) {

    let data = await response ({type: 'ssh_settings', id: 1})
    
    $('body').data ('data', data)

    $_SESSION.set ('__read_only', 1)

    return data

}
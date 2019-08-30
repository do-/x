////////////////////////////////////////////////////////////////////////////////

$_DO.cancel_user = function (e) {
    
    if (confirm ('Отменить несохранённые правки?')) w2_panel_form ().reload_block ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.edit_user = function (e) {

	$_SESSION.delete ('__read_only')
	
	w2_panel_form ().refresh ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.delete_user = async function (e) {
    
    if (!confirm ('Серьёзно?')) return
    
    await response ({type: 'users', action: 'delete'})

    refreshOpener ()
        
    window.close ()
    
}

////////////////////////////////////////////////////////////////////////////////

$_DO.pass_user = function (e) {

    show_block ('user_password')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_user = async function (e) {

    if (!confirm ('Сохранить изменения?')) return
    
    let form = w2_panel_form ()
    
    let data = form.values ().actual ().validated ()

    form.lock ()

    await response ({type: 'users', action: 'update'}, {data})

    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user = async function (o) {

    let data = await response ({type: 'users'})
    
    $('body').data ('data', data)

    $_SESSION.set ('__read_only', 1)

    return data

}
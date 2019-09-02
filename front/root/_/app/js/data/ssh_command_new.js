////////////////////////////////////////////////////////////////////////////////

$_DO.update_ssh_command_new = async function (e) {

    let f = w2_popup_form ()

    let data = f.values ().actual ().validated ()
    
    data.id_host = w2ui ['ssh_hosts_grid'].getSelection ()
    
    f.lock ()

    await response ({action: 'create', id: data.uuid}, {data})

	w2_close_popup_reload_grid ()

    w2_confirm_open_tab ('Комада зарегистрирована. Открыть её страницу?', '/ssh_command/' + data.uuid)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_command_new = async function (o) {

    let data = clone ($('body').data ('data'))
    
    data.uuid = new_uuid ()
    data.ttl  = 5
    
    return data

}
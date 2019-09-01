////////////////////////////////////////////////////////////////////////////////

$_DO.update_ssh_host_popup = async function (e) {

    let f = w2_popup_form ()
darn (f)
    let data = f.values ().actual ().validated ()
        
    f.lock ()

    let item = await response ({type: 'ssh_hosts', action: 'update', id: data.uuid}, {data})

	w2_close_popup_reload_grid ()

}

////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_host_popup = async function (o) {

    let data = clone ($('body').data ('data'))
    
    let _fields = data._fields

	if (!o.uuid) o = {uuid: new_uuid (), port: _fields.port.COLUMN_DEF}

    o._fields = _fields

    return o

}
////////////////////////////////////////////////////////////////////////////////

$_DO.update_user_new = async function (e) {

    let f = w2_popup_form ()

    let data = f.values ().actual ().validated ()
    
    data.uuid = new_uuid ()
    
    f.lock ()

    let item = await response ({action: 'create'}, {data})

	w2_close_popup_reload_grid ()

    w2_confirm_open_tab ('Пользователь зарегистрирован. Открыть его карточку?', '/user/' + item.uuid)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user_new = async function (o) {

    return $('body').data ('data')
    
}
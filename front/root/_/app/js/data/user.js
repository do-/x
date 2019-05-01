////////////////////////////////////////////////////////////////////////////////

$_DO.delete_user = async function (e) {
    
    if (!confirm ('Серьёзно?')) return
    
    await response ({action: 'delete'})

    refreshOpener ()
        
    window.close ()
    
}

////////////////////////////////////////////////////////////////////////////////

$_DO.pass_user = function (e) {

    use.block ('user_password')

}

////////////////////////////////////////////////////////////////////////////////

$_DO.update_user = async function (e) {

    if (!confirm ('Сохранить изменения?')) return

    let form = w2ui ['form']

    form.lock ()

    await response ({action: 'update'}, {data: form.values ()})

    location.reload ()

}

////////////////////////////////////////////////////////////////////////////////

$_DO.choose_tab_user = function (e) {

    localStorage.setItem ('user.active_tab', e.tab.id)

    show_block (e.tab.id)

}

////////////////////////////////////////////////////////////////////////////////

$_GET.user = async function (o) {

    let data = await response ({})
    
    data.active_tab = localStorage.getItem ('user.active_tab') || 'user_options'

    $('body').data ('data', data)

    return data

}
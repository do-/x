function _ts (record, ind, col_ind, data) {
    return dt_dmy (data) + ' ' + data.substr (11, 12)
}

(function () {

    clearTimeout (window.alarm)
    
    $(window).keydown (check_hotkeys)

    if (!$_USER) return show_block ('login')

    let [type, id] = location.pathname.split ('/').filter ((i) => i)

    if (!type) return redirect (window.name = '/ssh_commands')
        
    $_REQUEST = {type, id}

    show_block ('main')

})()
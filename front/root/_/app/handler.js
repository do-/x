(function () {

    clearTimeout (window.alarm)

    if (!$_USER) return show_block ('login')

    let [type, id] = location.pathname.split ('/').filter ((i) => i)

    if (!type) return redirect (window.name = '/users')

    $_REQUEST = {type, id}

    show_block ('main')

})()
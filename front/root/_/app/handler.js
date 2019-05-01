if (window.__LOGOUT__) delete window.__LOGOUT__

function get_default_url () {

    return '/users'

}

function setup_request () {

    var parts = location.pathname.split ('/').filter (function (i) {return i})
    
    if (!parts.length && $_USER && $_USER.role) return redirect (window.name = get_default_url ())

    $_REQUEST = {type: parts [0]}
    
    if (parts [1]) $_REQUEST.id = parts [1]

}

function dt_dmy    (v) { return !v ? '' : v.split ('-').reverse (). join ('.') }

function dt_dmy2   (v) { 
    if (!v) return ''
    var dmy = v.split ('-').reverse ()
    dmy [2] %= 100
    return dmy.join ('.')
}

function dt_dmyhms (v) { return !v ? '' : dt_dmy (v.substr (0, 10)) + v.substr (10,9)}

function __d (data) {

    for (i in data) {
    
        if (i.match (/^dt/)) {

            var v = data [i]

            if (!v || v.length != 10 || !v.match (/^\d\d\d\d-\d\d-\d\d$/)) continue

            data [i] = dt_dmy (v)

        }        
    
    }
    
    return data

}

function die (name, text) {
    alert (text)
    $('[name=' + name + ']').focus ()
    throw 'core.ok.validation'
}

function not_off (i) {return !i.off}

function reload_page () { location.reload () }

clearTimeout (window.alarm)

$_SESSION.beforeExpiry ($_SESSION.keepAlive)

window.addEventListener ('storage', $_SESSION.closeAllOnLogout)

if ($_USER && $_USER.opt && $_USER.opt.no_tabs) openTab = function (url, name) {
    window.name = name || url
    location = url
}

setup_request ()

show_block ($_USER ? 'main' : 'login')
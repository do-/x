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

clearTimeout (window.alarm)

$_SESSION.beforeExpiry ($_SESSION.keepAlive)

window.addEventListener ('storage', $_SESSION.closeAllOnLogout)

if ($_USER && $_USER.opt && $_USER.opt.no_tabs) openTab = function (url, name) {
    window.name = name || url
    location = url
}

setup_request ()

show_block ($_USER ? 'main' : 'login')
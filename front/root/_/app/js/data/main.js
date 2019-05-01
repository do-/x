////////////////////////////////////////////////////////////////////////////////

$_GET.main = async function (o) {

    if (window.__LOGOUT__) delete window.__LOGOUT__

    $_SESSION.beforeExpiry ($_SESSION.keepAlive)

    window.addEventListener ('storage', $_SESSION.closeAllOnLogout)

    if ($_USER.opt.no_tabs) open_tab = openTab = function (url, name) {
        window.name = name || url
        location = url
    }

}
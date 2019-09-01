////////////////////////////////////////////////////////////////////////////////

$_GET.main = async function (o) {

    if (window.__LOGOUT__) delete window.__LOGOUT__

    $_SESSION.beforeExpiry ($_SESSION.keepAlive)

    window.addEventListener ('storage', $_SESSION.closeAllOnLogout)

}
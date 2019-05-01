
define ([], function () {

    function get_single (s) {

        // if (s == '...') return '...' // exceptions

        return en_unplural (s)

    }

    function getBlockType () {
    
        if (!$_USER) return 'login'
        
        return $_REQUEST.id ? get_single ($_REQUEST.type) : $_REQUEST.type
        
    }

    $_F5 = function () {
        use.block (getBlockType ())
        show_block ('nav')
    }
    
    return function (data, view) {           
        fill (view, {}, $('body'))
        $_F5 ()
    }

});
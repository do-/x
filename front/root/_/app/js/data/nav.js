
////////////////////////////////////////////////////////////////////////////////

$_DO.open_equipment_cfg_schedule_nav = function () {
    show_block ('equipment_cfg_schedule')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_equipment_cfg_nav = function () {
    open_tab ('/equipment_configs')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_ssh_commands_nav = function () {
    open_tab ('/ssh_commands')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_ssh_settings_nav = function () {
    show_block ('ssh_settings')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_mfsm_settings_nav = function () {
    show_block ('mfsm_settings')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.open_users_nav = function () {
    open_tab ('/users')
}
    
////////////////////////////////////////////////////////////////////////////////

$_DO.open_user_password_nav = function () {
    show_block ('user_password')
}

////////////////////////////////////////////////////////////////////////////////

$_DO.logout_nav = function () {

    if (!confirm ("Завершить работу в системе?")) return
        
    query ({type: 'sessions', action: 'delete'}, {}, $.noop, $.noop)
    
    $_SESSION.end ()

    redirect ('/')

}

////////////////////////////////////////////////////////////////////////////////

$_GET.nav = async function (o) {

    let is_admin = ($_USER.role == 'admin')
    
    return {
    
        header: [
        
            {
                id: "open_ssh_commands",
                label: "Запуски SSH",
                icon: "menu",
            },
            {
                id: "open_ssh_settings",
                label: "Настройки",
                icon: "settings",
            },
            {
                id: "open_mfsm_settings",
                label: "Настройки WS MFSM",
                icon: "settings",
            },
            {
                id: "open_equipment_cfg",
                label: "Передача конфигураций оборудования",
                icon: "pos",
            },
            {
                id: "open_equipment_cfg_schedule",
                label: "Расписание",
                icon: "clock",
            },
/*            
            {
                id: "open_help",
                label: "Справка",
                icon: "help",
            },
*/            
            {
                id: "open_users",
                label: "Пользователи",
                icon: "users",
                off: !is_admin
            },
            
        ].filter (not_off),
        
        footer: [
        
            {
                id: "open_user_password",
                label: "Смена пароля",
                icon: "keys",
//                off: is_admin
            },
            {
                id: "logout",
                label: "Выход",
                icon: "logout",
            },
            
        ].filter (not_off),
        
    }
    
}
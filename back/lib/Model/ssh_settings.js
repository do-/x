module.exports = {

    label: 'Настройки исполнения SSH-команд',

    columns: {
        id       : 'int',
        ttl      : 'int=5    // Максимальное время ожидания для отдельного hostа, с',
        par      : 'int=1000 // Максимальное число одновременных SSH-соединений',
        timeout  : 'int=5    // Максимальное время исполнения запроса в целом, с',
		
		cb_url   : 'string   // URL 1-го WS MFSM для отправки извещения',
		cf_url   : 'string   // URL 1-го WS MFSM для отправки конфигурации',		
		cb_user  : 'string   // Basic-login 1-го WS MFSM',
		cb_pass  : 'string   // Basic-пароль 1-го WS MFSM',
		
		cb2_url  : 'string   // URL 2-го WS MFSM для отправки извещения',
		cf2_url  : 'string   // URL 2-го WS MFSM для отправки конфигурации',		
		cb2_user : 'string   // Basic-login 2-го WS MFSM',
		cb2_pass : 'string   // Basic-пароль 2-го WS MFSM',
		
		port     : 'int=22   // Порт',
		username : 'string   // Пользователь',
        cmd      : 'string   // Команда',
		shop_user: 'string   // Basic-login магазина',
        shop_salt: 'string   // "Соль" пароля магазина',
		shop_pass: 'string   // Basic-пароль магазина',
        cf_par   : 'int=10   // Максимальное число одновременных подключений к CMDB',
    },

    data: [{id: 1}],

}
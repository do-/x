module.exports = {

    label: 'Настройки исполнения SSH-команд',

    columns: {
        id       : 'int',
        ttl      : 'int=5    // Максимальное время ожидания для отдельного hostа, с',
        par      : 'int=1000 // Максимальное число одновременных соединений',
        timeout  : 'int=5    // Максимальное время исполнения запроса в целом, с',
		cb_url   : 'string   // URL для отправки извещения',
		cb_user  : 'string   // Basic-login для отправки извещения',
		cb_pass  : 'string   // Basic-пароль для отправки извещения',
		cf_url   : 'string   // URL для отправки конфигурации',		
		port     : 'int=22   // Порт',
		username : 'string   // Пользователь',
        cmd      : 'string   // Команда',
		shop_user: 'string   // Basic-login магазина',
        shop_salt: 'string   // "Соль" пароля магазина',
		shop_pass: 'string   // Basic-пароль магазина',
    },

    data: [{id: 1}],

}
module.exports = {

    label: 'Настройки исполнения SSH-команд',

    columns: {
        id       : 'int',
        ttl      : 'int // Максимальное время ожидания для отдельного hostа, с',
        par      : 'int // Максимальное число одновременных соединений',
        timeout  : 'int // Максимальное время исполнения запроса в целом, с',
    },

    data: [
        {
        	id:  1, 
        	ttl: 5, 
        	par: 1000, 
        	timeout: 5, 
        },
    ],

}
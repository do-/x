module.exports = {

    label: 'Настройки исполнения SSH-команд',

    columns: {
        id       : 'int',
        ttl      : 'int // Максимальное время ожидания для отдельного hostа, с',
    },

    data: [
        {
        	id:  1, 
        	ttl: 5, 
        },
    ],

}
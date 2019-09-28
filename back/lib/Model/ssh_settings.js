module.exports = {

    label: 'Настройки исполнения SSH-команд',

    columns: {
        id       : 'int',
        ttl      : 'int=5    // Максимальное время ожидания для отдельного hostа, с',
        par      : 'int=1000 // Максимальное число одновременных соединений',
        timeout  : 'int=5    // Максимальное время исполнения запроса в целом, с',
    },

    data: [{id: 1}],

}
module.exports = {

    label : 'SSH-хосты',

    columns : {
        is_deleted : 'int=0                                       // 1, если удалён', 
        host       : 'string                                      // Host',
        port       : 'int=22                                      // Порт',
        username   : 'string                                      // Пользователь',
        password   : 'string                                      // Пароль',
    },

    keys : {
        host    : 'UNIQUE (host)',
    },
    
}
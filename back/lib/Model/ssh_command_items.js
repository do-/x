module.exports = {

    label: 'SSH-команды по hostaм',

    columns: {
        id_command : "(ssh_commands) // команда",
        id_host    : "(ssh_hosts)    // host",
		ts_from    : 'timestamp,     // Дата/время запуска',
		ts_conn    : 'timestamp,     // Дата/время установления соединения',
		ts_to      : 'timestamp,     // Дата/время окончания',
		code       : 'int,           // Код завершения',
		signal     : 'string,        // Сигнал',
		error      : 'string,        // Ошибка',
    },

    keys: {
        id_command: 'id_command,id_host',
    },

}
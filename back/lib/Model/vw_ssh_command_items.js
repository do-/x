module.exports = {

    label: 'SSH-команды по hostaм',

    columns: {
        id_command : "(ssh_commands) // команда",
		ts_from    : 'timestamp,     // Дата/время запуска',
		ts_conn    : 'timestamp,     // Дата/время установления соединения',
		ts_to      : 'timestamp,     // Дата/время окончания',
		code       : 'int,           // Код завершения',
		signal     : 'string,        // Сигнал',
		error      : 'string,        // Ошибка',
		host       : 'string,        // SSH host',
        port       : 'int            // Порт',
        username   : 'string         // Пользователь',
		ms_conn    : 'int,           // время соединения, мс',
		ms_exec    : 'int,           // время исполнения, мс',
		ms_total   : 'int,           // время, мс',
    },

    sql: `
    	SELECT     	
    		uuid,
			id_command, 
			ts_from, 
			ts_conn, 
			ts_to, 
			code, 
			signal, 
			error,
			host,
			port,
			username,
			1000 * (extract (epoch from ts_conn) - extract (epoch from ts_from)) ms_conn,
			1000 * (extract (epoch from ts_to)   - extract (epoch from ts_conn)) ms_exec,
			1000 * (extract (epoch from ts_to)   - extract (epoch from ts_from)) ms_total
    	FROM
    		ssh_command_items
    `,

}
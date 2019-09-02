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
		ms_conn    : 'int,           // время соединения, мс',
		ms_exec    : 'int,           // время исполнения, мс',
		ms_total   : 'int,           // время, мс',
    },

    sql: `
    	SELECT     	
    		ssh_command_items.uuid,
			ssh_command_items.id_command, 
			ssh_command_items.ts_from, 
			ssh_command_items.ts_conn, 
			ssh_command_items.ts_to, 
			ssh_command_items.code, 
			ssh_command_items.signal, 
			ssh_command_items.error,
			ssh_hosts.host,
			1000 * (extract (epoch from ts_conn) - extract (epoch from ts_from)) ms_conn,
			1000 * (extract (epoch from ts_to)   - extract (epoch from ts_conn)) ms_exec,
			1000 * (extract (epoch from ts_to)   - extract (epoch from ts_from)) ms_total
    	FROM
    		ssh_command_items
    		INNER JOIN ssh_hosts ON ssh_command_items.id_host = ssh_hosts.uuid
    `,

}
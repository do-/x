module.exports = {

    label : 'SSH-команды',

    columns : {
        is_deleted : 'int=0              // 1, если удалена', 
        cmd        : 'string             // Команда',
        ttl        : 'int                // Время на исполнение, с',
		ts_created : 'timestamp=now()    // Дата/время создания',
//		id_host    : 'text               // JSON-массив UUID hostов',
		addr       : 'text               // JSON-массив записей {host, port, username}',
    },

    keys : {
        ts_created: '(ts_created)',
    },
    
    triggers: {

    	after_insert: `
    	    		
			INSERT INTO ssh_command_items (id_command, host, port, username) 
				SELECT 
					NEW.uuid id_command, 
					addr.* 
				FROM 
					json_to_recordset (NEW.addr::json) AS addr (host TEXT, port INT, username TEXT);

			RETURN NEW;
			
    	`,

    }

}
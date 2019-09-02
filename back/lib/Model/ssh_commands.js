module.exports = {

    label : 'SSH-команды',

    columns : {
        is_deleted : 'int=0              // 1, если удалена', 
        cmd        : 'string             // Команда',
        ttl        : 'int                // Время на исполнение, с',
		ts_created : 'timestamp=now()    // Дата/время создания',
		id_host    : 'text               // JSON-массив UUID hostов',
    },

    keys : {
        ts_created: '(ts_created)',
    },
    
    triggers: {

    	after_insert: `
    	    		
			INSERT INTO ssh_command_items (id_command, id_host) 
				SELECT NEW.uuid, json_array_elements_text (NEW.id_host::json)::uuid;
			
			RETURN NEW;
			
    	`,

    }

}
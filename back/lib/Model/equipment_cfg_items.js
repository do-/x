module.exports = {

    label: 'Конфигурации отдельных КЕ',

    columns: {    

        id_cfg    : "(equipment_cfgs) // запрос",
		ext_id    : 'string           // ext_id (имя хоста)',
		json      : 'string           // тело сообщения',

		ts_start  : 'timestamp        // Дата/время начала отправки',
		ts_finish : 'timestamp        // Дата/время подтверждения доставки',
		ts_error  : 'timestamp        // Дата/время ошибки доставки',
		error     : 'string           // Ошибка доставки',
		
    },

    keys: {
        id_cfg: 'id_cfg,ext_id',
    },

}
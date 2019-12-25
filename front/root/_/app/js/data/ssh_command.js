////////////////////////////////////////////////////////////////////////////////

$_DO.notify_completion_ssh_command = async function () {

    await response ({type: 'ssh_commands', action: 'notify_completion'})
    
    alert ('Извещение отправлено')
    
}

////////////////////////////////////////////////////////////////////////////////

$_GET.ssh_command = async function (o) {

    let data = await response ({type: 'ssh_commands'})
    
    $('body').data ('data', data)
    
    data.totals = [
    	{recid: 10, label: 'Старт', ts: data.ts_created},
    	{recid: 20, label: 'Работа завершена, отправка извещения', ts: data.ts_notif_start, delta: data.ms_exec},
    ]
    
    if (data.ts_notif_finish) data.totals.push ({recid: 30, label: 'Извещение доставлено', ts: data.ts_notif_finish, delta: data.ms_notif})
    if (data.ts_notif_error)  data.totals.push ({recid: 40, label: 'Ошибка доставки', ts: data.ts_notif_error, delta: data.ms_notif, error: data.notif_error})
    
    if (data.ts_notif_finish2) data.totals.push ({recid: 50, label: 'Извещение доставлено 2', ts: data.ts_notif_finish2, delta: data.ms_notif2})
    if (data.ts_notif_error2)  data.totals.push ({recid: 60, label: 'Ошибка доставки 2', ts: data.ts_notif_error2, delta: data.ms_notif2, error: data.notif_error2})

    return data

}
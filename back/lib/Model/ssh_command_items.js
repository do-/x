module.exports = {

    label: 'SSH-команды по hostaм',

    columns: {
        id_command : "(ssh_commands) // команда",
        id_host    : "(ssh_hosts)    // host",
    },

    keys: {
        id_command: 'id_command,id_host',
    },

}
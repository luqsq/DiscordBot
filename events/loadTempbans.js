module.exports = {
    event: 'ready',
    run: async (client, mysql) => {
        const [result] = await mysql.execute("SELECT user_id, duration FROM punishments WHERE action = 'tempban_active'");
        for(let i = 0; i < result.length; i++) client.tempbans.set(result[i].user_id, result[i].duration * 1000);
    }
}

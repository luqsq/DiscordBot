const { publicId } = require('../config.js');

module.exports = {
    schedule: '0 * * * * *',
    run: async (client, mysql) => {
        const now = Date.now();
        client.tempbans.filter(time => time < now).forEach(async (time, user) => {
            try {
                await client.guilds.cache.get(publicId).members.unban(user, 'Czas bana minął.');
            }
            catch(e) {
                console.log(e);
            }
            client.tempbans.delete(user);
            await mysql.query(`UPDATE punishments SET action = 'tempban' WHERE action = 'tempban_active' AND user_id = '${user}'`);
        });;
    }
}
const { support } = require('../../permissions.js');
const { getPermLvl } = require('../../utils.js');
const { supportCategory } = require('../../config.js');

module.exports = {
    name: 'claim',
    desc: 'Ustaw, że zajmujesz się daną sprawą.',
    run: async (msg, args, client, mysql) => {

        if(msg.channel.parentId != supportCategory) return;

        if(getPermLvl(msg.member.roles.cache) < support) return msg.channel.send('Nie masz uprawnień.');

        msg.delete();
        msg.channel.send(`Sprawą zajmuje się **${msg.author.username}**.`);

        const id = msg.channel.topic.slice(1);
        await mysql.query(`UPDATE tickets SET admin_id = ${msg.author.id} WHERE id = ${id}`);

    }
}
const { crewId } = require('../config.js');

module.exports = {
    event: 'messageCreate',
    run: (client, mysql, msg) => {
        if(!msg.content.startsWith(client.prefix)) return;
        if(msg.author.bot) return;
        const args = msg.content.slice(client.prefix.length).split(' ');
        const cmd = client.commands.get(args.shift().toLowerCase());
        if(cmd) {
            if(msg.guildId != crewId && cmd.type == 'crew') return;
            cmd.run(msg, args, client, mysql);
        }
    }
}
const { crewId, publicId } = require('../config.js');

module.exports = {
    event: 'messageCreate',
    run: (client, mysql, msg) => {
        if(!msg.content.startsWith(client.prefix)) return;
        if(msg.author.bot) return;
        const args = msg.content.slice(client.prefix.length).split(' ');
        const cmdname = args.shift().toLowerCase();
        const cmd = client.commands.get(cmdname) || client.commands.get(client.aliases.get(cmdname));
        if(cmd) {
            if(msg.guildId != crewId && cmd.type == 'crew') return;
            if(msg.guildId != publicId && cmd.type == 'moderation') return;
            cmd.run(msg, args, client, mysql);
        }
    }
}
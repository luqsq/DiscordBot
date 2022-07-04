const { MessageEmbed } = require('discord.js');
const { publicId, lvlRoles, logChannel } = require('../config.js');

module.exports = {
    event: 'guildMemberAdd',
    run: async (client, mysql, member) => {
        if(member.guild.id != publicId) return;
        (await client.channels.fetch(logChannel)).send({embeds:[
            new MessageEmbed().setAuthor({ name: member.user.tag, iconURL: member.displayAvatarURL() })
            .setTitle('Nowy użytkownik').setDescription(member.toString()).setColor('86dc3d').setTimestamp()
        ]});
        const [result] = await mysql.query(`SELECT level FROM public_users WHERE user_id = '${member.id}'`);
        if(result.length == 0) return;
        const levels = Object.keys(lvlRoles).sort((a, b) => b - a);
        for(let level of levels) {
            if(result[0].level < level) continue;
            await member.roles.add(lvlRoles[level]);
            break;
        }
    }
}
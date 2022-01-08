const { publicId, lvlRoles } = require('../config.js');

module.exports = {
    event: 'guildMemberAdd',
    run: async (client, mysql, member) => {
        if(member.guild.id != publicId) return;
        const [result] = await mysql.execute(`SELECT level FROM public_users WHERE user_id = '${member.id}'`);
        if(result.length == 0) return;
        const levels = Object.keys(lvlRoles).sort((a, b) => b - a);
        for(let level of levels) {
            if(result[0].level < level) continue;
            member.roles.add(lvlRoles[level]);
            break;
        }
    }
}
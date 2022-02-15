const { MessageEmbed } = require('discord.js');
const { crewId, publicId, exp, roles, modChannel } = require('./config.js');
const { permLvl } = require('./permissions.js');
module.exports = {
    getExp: (guild, roles1) => {
        let bonus = 1;
        if(guild == publicId) {
            if(roles1.has(roles.sponsorPlusId)) bonus = exp.sponsorPlusBonus;
            else if(roles1.has(roles.sponsorId)) bonus = exp.sposnorBonus;
            if(roles1.has(roles.publicNitroBoosterId)) bonus += 0.1;
        }
        else if(guild == crewId) {
            if(roles1.has(roles.crewNitroBoosterId)) bonus += 0.1;
        }
        return Math.floor((Math.random() * (exp.max - exp.min + 1) + exp.min) * bonus);
    },
    getRequiredExp: lvl => Math.round((100 + lvl * 55 + ((lvl - 1) * lvl / 2) * 10) * 1.05),
    getEmbed: member => new MessageEmbed().setColor('aa8dd7').setFooter({text: `Wysłano na polecenie ${member.user.username}`, iconURL: member.displayAvatarURL()}).setTimestamp(),
    getTable: id => {
        if(id == publicId) return 'public';
        else if(id == crewId) return 'crew';
        else return null;
    },
    getTime: str => {
        const type = str[str.length - 1];
        const value = parseInt(str);
        if(!value) return null;
        switch(type) {
            case 'm':
                return {time: value * 60, text: `${value} min.`};
            case 'h':
                return {time: value * 3600, text: `${value} godz.`};
            case 'd':
                return {time: value * 86400, text: `${value} ${value == 1 ? 'dzień' : 'dni'}`};
            default:
                return null;
        }
    },
    sendModError: (msg, error) => {
        if(msg.channelId == modChannel) return msg.channel.send(error);
        msg.delete();
        msg.guild.channels.cache.get(modChannel).send({
            content: `<@${msg.author.id}>`,
            embeds: [
                new MessageEmbed().setColor('ee2222').setTimestamp()
                .setAuthor({ name: msg.author.username, iconURL: msg.member.displayAvatarURL() })
                .addField(`Wiadomość (#${msg.channel.name}):`, msg.content)
                .addField('Błąd:', error + '\nPomoc znajdziesz pod `!komendymod`')
            ]
        });
    },
    format: (d, s = ' ') => {
        const f = n => n <= 9 ? '0' + n : n;
        return `${f(d.getDate())}.${f(d.getMonth()+1)}.${d.getFullYear()+s+f(d.getHours())}:${f(d.getMinutes())}`;
    },
    getPermLvl: roles => {
        let max = 0;
        roles.forEach(r => {
            const plvl = permLvl[r.id];
            if(!plvl) return;
            if(max < plvl.lvl) max = plvl.lvl;
        });
        return max;
    },
    getPermLvlNameType: (roles, type) => {
        let max = { lvl: 0 };
        roles.forEach(r => {
            const plvl = permLvl[r.id];
            if(plvl)
            if(plvl.type == type || plvl.type == 0)
            if(max.lvl < plvl.lvl) max = { lvl: plvl.lvl, name: r.name };
        });
        return max;
    }
}
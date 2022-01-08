const { MessageEmbed } = require('discord.js');
const { crewId, publicId, exp } = require('./config.js');
module.exports = {
    getExp: (guild, roles) => {
        let bonus = 1;
        if(guild == publicId) {
            if(roles.has(exp.sponsorPlusId)) bonus = exp.sponsorPlusBonus;
            else if(roles.has(exp.sponsorId)) bonus = exp.sposnorBonus;
            if(roles.has(exp.publicNitroBoosterId)) bonus += 0.1;
        }
        else if(guild == crewId) {
            if(roles.has(exp.crewNitroBoosterId)) bonus += 0.1;
        }
        return Math.floor((Math.random() * (exp.max - exp.min + 1) + exp.min) * bonus);
    },
    getRequiredExp: lvl => Math.round((100 + lvl * 55 + ((lvl - 1) * lvl / 2) * 10) * 1.05),
    getEmbed: member => new MessageEmbed().setColor('aa8dd7').setFooter({text: `Wysłano na polecenie ${member.user.username}`, iconURL: member.displayAvatarURL()}).setTimestamp(),
    getTable: id => {
        if(id == publicId) return 'public';
        else if(id == crewId) return 'crew';
        else return null;
    }
}
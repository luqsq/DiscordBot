const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { lvlRoles } = require('../../config.js');
const { getRequiredExp, getPermLvl } = require('../../utils.js');
const { permLvl } = require('../../permissions.js');

const admins = ['153182055214088192', '387246119371014144'];

module.exports = {
    name: 'admin',
    hidden: true,
    run: (msg, args, client) => {
        if(!admins.includes(msg.author.id)) return msg.channel.send('Nie masz uprawnień.');
        switch(args[0]) {

            case 'lvl':
                if(args.length == 1) return msg.reply('Poziom musi być liczbą.');
                const lvl = parseInt(args[1]);
                if(isNaN(lvl)) return msg.reply('Poziom musi być liczbą.');
                let exp = 0;
                for(let i = 0; i < lvl; i++) exp += getRequiredExp(i);
                msg.channel.send(`Exp wymagany na poziom ${lvl} to **${exp}**.`);
                return;

            case 'listarang':
                const keys = Object.keys(lvlRoles);
                const values = Object.values(lvlRoles);
                let text = '';
                for(let i = 0; i < keys.length; i++) {
                    text += `${keys[i]} lvl -> <@&${values[i]}>\n`
                }
                msg.channel.send(text);
                return;

            case 'support':
                msg.delete();
                msg.channel.send({
                    embeds: [
                        new MessageEmbed().setAuthor({ name: 'Crafted.pl - Wsparcie', iconURL: client.user.displayAvatarURL() })
                        .setDescription('Wybierz kategorię, klikając odpowiedni przycisk,\naby utworzyć nowy kanał pomocy!\n\nUwaga! Pamiętaj, że nie zawsze jest ktoś z administracji, kto zajmuje się aktualnie kanałem pomocy.').setColor('aa8dd7')
                    ],
                    components: [
                        new MessageActionRow().setComponents(
                            new MessageButton().setCustomId('open-ticket_1').setStyle(1).setLabel('Serwer'),
                            new MessageButton().setCustomId('open-ticket_4').setStyle(1).setLabel('Forum'),
                            new MessageButton().setCustomId('open-ticket_5').setStyle(1).setLabel('Inne')
                        )
                    ]
                });
                return;

            case 'permlvl':
                const member = msg.mentions.members.first() || msg.member;
                msg.channel.send(`PermLvl dla **${member.user.username}**: ${getPermLvl(member.roles.cache)}`);
                return;

            case 'perms':
                let m = '';
                Object.entries(permLvl).forEach(r => {
                    m += `<@&${r[0]}> -> ${r[1].lvl} (type: ${r[1].type})\n`;
                });
                msg.channel.send({
                    content: m,
                    allowedMentions: {
                        parse: []
                    }
                });
                return;
            
            default:
                msg.channel.send('**Dostępne opcje:**\nlvl, listarang, support, permlvl, perms');
                
        }
    }
}

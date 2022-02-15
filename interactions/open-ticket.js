const { permLvl } = require('../permissions.js');
const { supportCategory, supportRole } = require('../config.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'open-ticket',
    run: async (ia, args, client, mysql) => {
        const perms = [{
            id: ia.guild.roles.everyone.id,
            deny: 'VIEW_CHANNEL',
            type: 'role'
        },{
            id: ia.member.id,
            allow: 'VIEW_CHANNEL',
            type: 'member'
        }];
        Object.entries(permLvl).filter(r => r[1].type == args[0] || r[1].type == 0).forEach(r => {
            perms.push({
                id: r[0],
                allow: 'VIEW_CHANNEL',
                type: 'role'
            });
        });
        await mysql.execute(`INSERT INTO tickets VALUES (NULL, '${ia.member.id}', ${parseInt(Date.now()/1000)}, 0, ${args[0]}, 0)`);
        const [result] = await mysql.execute('SELECT LAST_INSERT_ID() AS id');
        const chn = await (await client.channels.fetch(supportCategory)).createChannel(
            ia.user.username, { topic: `#${result[0].id}`, permissionOverwrites: perms }
        );
        ia.reply({
            content: `Stworzono nowy kanał pomocy: ${chn}`,
            ephemeral: true
        });
        (await chn.send({
            content: `${ia.member.toString()} / <@&${supportRole}>`,
            embeds: [
                new MessageEmbed().setTitle('Oto nowy kanał pomocy!').setColor('aa8dd7').setTimestamp()
                .setDescription('Opisz swój problem, a administracja Ci pomoże!\nAby zamknąć zgłoszenie, kliknij w poniższy przycisk.')
            ],
            components: [
                new MessageActionRow().setComponents(
                    new MessageButton().setCustomId('close-ticket').setStyle(4).setEmoji('🔒').setLabel('Zamknij zgłoszenie'),
                )
            ]
        })).pin();
    }
}
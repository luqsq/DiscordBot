const { permLvl } = require('../permissions.js');
const { supportCategory, supportRole } = require('../config.js');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'open-ticket',
    run: async (ia, args, client, mysql) => {
        const [r] = await mysql.query(`SELECT id FROM tickets WHERE user_id = '${ia.member.id}' AND start_timestamp + 300 > ${parseInt(Date.now()/1000)} AND end_timestamp = 0`);
        if(r.length != 0) return ia.reply({
            content: `Posiadasz już kanał pomocy.`,
            ephemeral: true
        });
        const perms = [{
            id: client.user.id,
            allow: 'VIEW_CHANNEL',
            type: 'member'
        },{
            id: ia.guild.roles.everyone.id,
            deny: 'VIEW_CHANNEL',
            type: 'role'
        },{
            id: ia.member.id,
            allow: 'VIEW_CHANNEL',
            type: 'member'
        }];
        let roles = Object.entries(permLvl);
        if(args[0] < 4) roles = roles.filter(r => r[1].type == args[0] || r[1].type == 0);
        roles.forEach(r => {
            perms.push({
                id: r[0],
                allow: 'VIEW_CHANNEL',
                type: 'role'
            });
        });
        await mysql.query(`INSERT INTO tickets VALUES (NULL, '${ia.member.id}', '', ${parseInt(Date.now()/1000)}, 0, ${args[0]}, 0)`);
        const [result] = await mysql.query('SELECT id FROM tickets ORDER BY id DESC LIMIT 1');
        const chn = await (await client.channels.fetch(supportCategory)).createChannel(
            `${ia.user.username}-pomoc`, { topic: `#${result[0].id}`, permissionOverwrites: perms }
        );
        ia.reply({
            content: `Stworzono nowy kanał pomocy: ${chn}`,
            ephemeral: true
        });
        (await chn.send({
            content: `${ia.member.toString()} / <@&${supportRole}>`,
            embeds: [
                new MessageEmbed().setTitle('Oto nowy kanał pomocy!').setColor('aa8dd7').setTimestamp()
                .setDescription('Opisz swój problem i czekaj na odpowiedź administracji!\nPamiętaj, że nie zawsze jest ktoś z administracji, kto zajmuje się aktualnie kanałem pomocy.\nAby zamknąć zgłoszenie, kliknij w poniższy przycisk.')
            ],
            components: [
                new MessageActionRow().setComponents(
                    new MessageButton().setCustomId('close-ticket').setStyle(4).setEmoji('🔒').setLabel('Zamknij zgłoszenie'),
                )
            ]
        })).pin();
    }
}

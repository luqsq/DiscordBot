const { support, claimLvl, permLvl } = require('../../permissions.js');
const { getPermLvlNameType } = require('../../utils.js');
const { supportCategory } = require('../../config.js');

module.exports = {
    name: 'claim',
    desc: 'Ustaw permisje dla kanału pomocy.',
    run: async (msg, args, client, mysql) => {
        
        if(msg.channel.parentId != supportCategory) return;

        const id = msg.channel.topic.slice(1);

        const [result] = await mysql.execute(`SELECT user_id, type FROM tickets WHERE id = ${id}`);
        let {type} = result[0];

        const plvl = getPermLvlNameType(msg.member.roles.cache, type);
        let {lvl} = plvl;
        let {name} = plvl;

        if(lvl < support) return msg.channel.send('Nie masz uprawnień.');

        let p;
        if(args.length > 0 && lvl >= claimLvl) {
            if(isNaN(args[0])) return msg.channel.send('Wpisano nieprawidłową liczbę.');
            lvl = parseInt(args[0]);
            p = Object.entries(permLvl).filter(r => r[1].lvl >= lvl && (r[1].type == type || r[1].type == 0));
            let min = {lvl:100};
            p.forEach(r => { if(r[1].lvl < min.lvl) min = {lvl:r[1].lvl,id:r[0]}; });
            name = (await msg.guild.roles.fetch(min.id)).name;
        }
        else { p = Object.entries(permLvl).filter(r => r[1].lvl >= lvl && (r[1].type == type || r[1].type == 0)); }

        const perms = [{
            id: msg.guild.roles.everyone.id,
            deny: 'VIEW_CHANNEL',
            type: 'role'
        },{
            id: result[0].user_id,
            allow: 'VIEW_CHANNEL',
            type: 'member'
        }];
        p.forEach(r => {
            perms.push({
                id: r[0],
                allow: 'VIEW_CHANNEL',
                type: 'role'
            });
        });

        await msg.delete();
        await msg.channel.edit({ permissionOverwrites: perms });
        await msg.channel.send(`Kanał jest teraz widoczny dla rangi **${name}** i wyższych.`);

        await mysql.execute(`UPDATE tickets SET perm_lvl = ${lvl} WHERE id = ${id}`);

    }
}
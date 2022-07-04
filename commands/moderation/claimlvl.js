const { support, claimLvl, permLvl } = require('../../permissions.js');
const { getPermLvlName, getPermLvlNameType } = require('../../utils.js');
const { supportCategory } = require('../../config.js');

module.exports = {
    name: 'claimlvl',
    desc: 'Ustaw permisje dla kanału pomocy.',
    run: async (msg, args, client, mysql) => {
        
        if(msg.channel.parentId != supportCategory) return;

        const id = msg.channel.topic.slice(1);

        const [result] = await mysql.query(`SELECT user_id, type FROM tickets WHERE id = ${id}`);
        let {type} = result[0];

        let plvl;
        if(type < 4) plvl = getPermLvlNameType(msg.member.roles.cache, type);
        else plvl = getPermLvlName(msg.member.roles.cache);
        let {lvl} = plvl;
        let {name} = plvl;

        if(lvl < support) return msg.channel.send('Nie masz uprawnień.');

        let p = Object.entries(permLvl);
        if(args.length > 0 && lvl >= claimLvl) {
            if(isNaN(args[0])) return msg.channel.send('Wpisano nieprawidłową liczbę.');
            lvl = parseInt(args[0]);
            if(type < 4) p = p.filter(r => r[1].lvl >= lvl && (r[1].type == type || r[1].type == 0));
            else p = p.filter(r => r[1].lvl >= lvl);
            let min = {lvl:100};
            p.forEach(r => { if(r[1].lvl < min.lvl) min = {lvl:r[1].lvl,id:r[0]}; });
            name = (await msg.guild.roles.fetch(min.id)).name;
        }
        else { 
            if(type < 4) p = p.filter(r => r[1].lvl >= lvl && (r[1].type == type || r[1].type == 0));
            else p = p.filter(r => r[1].lvl >= lvl);
        }

        const perms = [{
            id: client.user.id,
            allow: 'VIEW_CHANNEL',
            type: 'member'
        },{
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

        await mysql.query(`UPDATE tickets SET perm_lvl = ${lvl} WHERE id = ${id}`);

    }
}

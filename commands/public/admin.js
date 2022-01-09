const { lvlRoles } = require('../../config.js');
const { getRequiredExp } = require('../../utils.js');

const admins = ['153182055214088192', '387246119371014144'];

module.exports = {
    name: 'admin',
    hidden: true,
    run: (msg, args, client) => {
        if(!admins.includes(msg.author.id)) return msg.channel.send('Nie masz uprawnień.');
        switch(args[0]) {

            case 'lvl':
                if(args.length == 1) return msg.channel.send('Musisz podać poziom.');
                const lvl = parseInt(args[1]);
                if(isNaN(lvl)) return msg.channel.send('Poziom musi być liczbą.');
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

            default:
                msg.channel.send('Niepoprawne użycie komendy.');
                
        }
    }
}
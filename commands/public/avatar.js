const { getEmbed } = require('../../utils.js');

module.exports = {
    name: 'avatar',
    usage: '[@nick|id]',
    desc: 'Wyświetla avatar użytkownika.',
    run: async (msg, args, client) => {
        if(args.length > 1) {
            msg.channel.send(`Za dużo argumentów.\nUżycie: \`${client.prefix}avatar [@nick|id]\``);
            return;
        }
        let user, name;
        if(args.length == 0) user = msg.member;
        else try {
            user = msg.mentions.members.first() || await client.users.fetch(args[0]);
        }
        catch(e) {
            msg.channel.send(`Nie znaleziono takiego użytkownika.\nUżycie: \`${client.prefix}avatar [@nick|id]\``);
            return;
        }
        if(user.hasOwnProperty('username')) name = user.username;
        else name = user.user.username;
        msg.channel.send({embeds:[getEmbed(msg.member).setTitle(`Avatar - ${name}`).setImage(user.displayAvatarURL({ format: 'png', size: 1024, dynamic: true }))]});
    }
}
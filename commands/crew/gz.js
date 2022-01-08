module.exports = {
    name: 'gz',
    hidden: true,
    run: async (msg, args, client) => {
        if(!msg.member.roles.highest.name.includes('Admin')) {
            msg.channel.send('Nie masz uprawnień.');
            return;
        }
        const mention = msg.mentions.members.first();
        if(!mention) {
            msg.channel.send(`Nie oznaczono żadnego użytkownika.\nUżycie: \`${client.prefix}gz <@nick>\``);
            return;
        }
        for(let i = 0; i < 10; i++) msg.channel.send(`Gratulacje ${mention}!!!  🎉`);
    }
}
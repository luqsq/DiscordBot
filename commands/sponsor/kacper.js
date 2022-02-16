module.exports = {
    name: 'kacper',
    desc: '<nick> dołączył do rozmowy',
    run: msg => {
        msg.delete();
        msg.channel.send(`**${msg.author.username}** dołączył do rozmowy <:hi:403665204623179786>`);
    }
}
module.exports = {
    name: 'wakacje',
    desc: 'Za ile wakacje (lub koniec)...?',
    run: msg => {
        const days = Math.floor((new Date(2022, 05, 24, 12).getTime() - Date.now())/86400000);
        msg.channel.send(`☀️ Wakacje za **${days}** dni! ☀️`);
    }
}
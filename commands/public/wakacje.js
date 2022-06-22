module.exports = {
    name: 'wakacje',
    desc: 'Za ile wakacje (lub koniec)...?',
    run: msg => {
        const today = new Date();
        const unix = today.getTime();
        const year = today.getFullYear() + (today.getMonth() > 7 ? 1 : 0);
        const date = new Date(year, 6, 0, 12);
        const d = date.getDay();
        let day = date.getDate() - (d == 0 ? 7 : d) + 5;
        if(day - 7 > 20) day -= 7;
        date.setDate(day);
        const date2 = new Date(year, 8, 1, 9);
        if(unix < date.getTime()) msg.channel.send(`☀️ Wakacje za **${Math.floor((date - unix)/86400000)}** dni! ☀️`);
        else msg.channel.send(`☀️ Koniec wakacji za **${Math.floor((date2 - unix)/86400000)}** dni! ☀️`);
    }
}

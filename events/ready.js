module.exports = {
    event: 'ready',
    run: client => {
        client.user.setActivity('!komendy');
        console.log('Bot aktywny, wersja v1.1.0');
    }
}

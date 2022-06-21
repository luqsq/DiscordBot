module.exports = {
    event: 'ready',
    run: (client) => {
        console.log('Bot aktywny, wersja v' + client.version);
    }
}

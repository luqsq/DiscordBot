module.exports = {
    event: 'ready',
    run: client => {
        client.user.setActivity('!komendy');
        console.log('done');
    }
}
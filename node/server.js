function startServer(app) {
    app.listen('8001', () => {
        console.log('Server has connected to port 8001');
    })
}

module.exports.startServer = startServer;
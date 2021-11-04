module.exports = (app, db) => {

    app.get('/sentmentanalysis', function(req, res) {
        // send the main (and unique) page
        res.setHeader('Content-Type', 'text/html');
        res.sendFile( __dirname + '/views' + '/sentiment-report.html');
    });

}
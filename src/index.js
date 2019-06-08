
import api from './api';
import express from 'express';
import bodyParser from 'body-parser';


var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', api());

var port = process.env.PORT || 9311;

app.listen(port, function () {
    console.log('Server started on port:' + port);
});

export default app;
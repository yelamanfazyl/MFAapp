const app = require('./app');
const databaseConnect = require('./config/database.js');

databaseConnect();

app.listen('8080', () => {
    console.log(`Example app listening on port 8080`);
});

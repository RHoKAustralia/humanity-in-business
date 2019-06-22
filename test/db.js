require('./../db');

db.query('SELECT 1 + 1 AS solution', (error, result) => {
    if (error) {
        console.log('Something went wrong with db connection: ' + error);
        return;
    }
    console.log('Success! Database connection established.');
    process.exit()

});

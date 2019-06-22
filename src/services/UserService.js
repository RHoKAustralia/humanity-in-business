require('../../db');

class UserService {
    respond(message) {
        return new Promise((resolve, reject) => {
            db.query('SELECT 1 + 1 AS solution', (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Database connection established.');
                console.log(result);
                resolve(result);
                //process.exit()
            });
        });
        // return `hello ${message}`;
    }

    login(username, password) {
        console.log(`${username} ${password}`);

        return new Promise((resolve, reject) => {
            db.query('SELECT 1 + 1 AS solution', (error, result) => {
                if (error) {
                    console.log('Something went wrong with db connection: ' + error);
                    reject(new Error(error));
                    return;
                }
                console.log('Success! Database connection established.');
                resolve(result);
                //process.exit()
            });
        });
    }

    register(userData) {
        console.log(userData);
        
        return 'User registered';
    }

    getProfile(profileId) {
        return 'TG';
    }
}

module.exports = UserService;

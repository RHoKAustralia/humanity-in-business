class UserService {
    respond(message) {
        return `hello ${message}`;
    }

    login = function(username, password) {
        console.log(`${username} ${password}`);
        
        return true;
    }

    register = function(userData) {
        console.log(userData);
        
        return 'User registered';
    }
}

module.exports = UserService;

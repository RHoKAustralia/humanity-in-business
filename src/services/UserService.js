class UserService {
    respond(message) {
        return `hello ${message}`;
    }

    login(username, password) {
        console.log(`${username} ${password}`);
        
        return true;
    }

    register(userData) {
        console.log(userData);
        
        return 'User registered';
    }
}

module.exports = UserService;

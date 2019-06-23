require('../../db');

class ChallengeService{
    async addChallengeToUser(challengeData) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO user_challenges SET ?', {
                user_id: challengeData.user_id,
                challenge_id: challengeData.challenge_id,
            }, function (error, results, fields) {
                if (error) {
                    return reject(Error(error));
                }
                return resolve(results.insertId);
            });
        });
    }
}

module.exports = ChallengeService;
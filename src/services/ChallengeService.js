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

    async getChallenge(challengeId) {
        return new Promise((resolve, reject) => {
            db.query('select title, description, location, challenge_date, points, image_url from challenges where id = ?;',
                [challengeId]
                , function (error, result) {
                    if (error) {
                        reject(new Error(error));
                        return;
                    }

                    let data = result[0];

                    // Now that we have the data, we need to get related badges
                    data['badges'] = [];
                    db.query('select b.name, b.image_url from challenges c join challenge_badges cb on c.id = cb.challenge_id ' +
                        'join badges b on cb.badge_id = b.id where c.id = ?;',
                        [challengeId]
                        , function (error, badges) {
                            if (error) {
                                reject(new Error(error));
                                return;
                            }

                            // Assign badges to the data object
                            if (badges) {
                                data['badges'] = badges;
                            }

                            return resolve(data);
                        });
                });


        });
    }
}

module.exports = ChallengeService;
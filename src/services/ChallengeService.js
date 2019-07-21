require('../../db');

class ChallengeService{

    async addChallengeToUser(challengeData) {
        const {rows} = await db.query('INSERT INTO companies (user_id, challenge_id) VALUES ($1, $2)'
            + ' RETURNING id',
            [challengeData.user_id,
                challengeData.challenge_id]);
        return rows[0].id
    }


    async getChallenge(challengeId) {
        try {
            const {rows} = await db.query('select title, description, location, challenge_date, points, image_url from challenges where id = $1',
                [challengeId]);

            const challenge = rows[0];

            try {
                const {rows} = await db.query(`select b.name, b.image_url from challenges c join challenge_badges cb on c.id = cb.challenge_id join badges b on cb.badge_id = b.id where c.id = $1;`,
                    [challengeId]);
                if (rows.length > 0) {
                    challenge.badges = rows;
                } else {
                    challenge.badges = [];
                }

            } catch (error) {
                console.log(error)
                challenge.badges = [];
            }
            return challenge;
        } catch (error) {
            console.log(error)
            throw  Error('Failed to get challenge')
        }
    }
}

module.exports = ChallengeService;
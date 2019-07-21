require('../../db');


class SkillService {

    async getAllSkills() {
        try {
            const {rows} = await db.query('SELECT * from skills');

            if (rows.length > 0) {
                return rows;
            } else {
                return false;
            }

        } catch (error) {
            console.log(error)
            throw  Error('Failed to get all skills')
        }
    }

}

module.exports = SkillService;

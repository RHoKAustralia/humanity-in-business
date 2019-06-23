require('../../db');


class SkillService {
    getAllSkills() {
        return new Promise((resolve, reject) => {
            db.query('SELECT * from skills', (error, result) => {
                if (error) {
                    reject(new Error(error));
                    return;
                }
                resolve(result);
            });
        });
    }
}

module.exports = SkillService;

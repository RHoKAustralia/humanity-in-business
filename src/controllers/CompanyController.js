const CompanyService = require('../services/CompanyService');
const companyService = new CompanyService();

exports.getCompanySDGs = async (req, res, next) => {
    try {
        const response = await companyService.getSDGs(req.params.id);
        res.send(response);
    } catch (error) {
        console.log(error);
        next(error);
    }
    next();
};
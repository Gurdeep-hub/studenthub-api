const verifyRoles = (...allowedRoles) => { // high order func
    return (req, res, next) => {

        if (!req.roles) {
            return res.sendStatus(401);
        }

        const rolesArray = [...req.roles];

        const hasPermission = rolesArray.some(
            role => allowedRoles.includes(role)
        );

        if (!hasPermission) {
            return res.sendStatus(403);
        }

        next();
    };
};

module.exports = verifyRoles;
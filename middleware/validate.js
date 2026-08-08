const validate = (schema)=>{
    return (req,res,next)=>{
        try {
            req.bpdy = schema.parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = validate;
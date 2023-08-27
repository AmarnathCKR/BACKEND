const Joi = require('joi');
const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
  })
  

  const userValidate = async (req, res, next) => {
    const {name,email,password} = req.body;
    if(name && email && password){
        const { error, value } = await schema.validate(req.body);
        if(error){
            return res.status(404).send({message : error}) 
        }
        return next();
    } else {
        return res.status(404).send({message : "Incomplete request"})
    }
}


module.exports = userValidate;

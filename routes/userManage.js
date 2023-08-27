const router = require("express").Router();
const User = require("../Database/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userValidate = require("../middlewares/userValidater");
const userAuth = require("../middlewares/userAuth");

const createToken = (_id) => {
    return jwt.sign({ _id }, "secretkey");
};

router.post("/signup", userValidate, async (req, res) => {
    const { name, email, password } = req.body;
    console.log("1111111111111111111111111111")
    try {
        const user = await User.findOne({ email: email });

        if (user) {
            console.log("User already exists");
            return res.status(400).json({ error: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashPassword,
        });
        await newUser.save();

        const userId = newUser._id;
        const token = await createToken(userId);

        return res.status(200).json({ token });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Server error" });
    }
});

router.get("/verifytoken",userAuth,async (req,res)=>{
    const {id}=req.params;
    await User.findOne({_id : id})
    .then((user)=>{
        res.status(200).send(user)

    }).catch((err)=>{
        res.status(404).send({error : err});
    })
})

router.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    await User.findOne({email}).then(async (user)=>{
        const match = await bcrypt.compare(password, user.password);
        if(match){
            const token = await createToken(user._id);
            console.log(token)
            res.status(200).json({ token });
        }else{
            res.status(400).send({error : "invalid email or password"});
        }
    }).catch((err)=>{
        res.status(400).send({error : "invalid email or password"});
    })
})


module.exports = router;
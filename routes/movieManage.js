const router = require("express").Router();
const Movie = require("../Database/movieSchema");
const userAuth = require("../middlewares/userAuth");
const validateMovie = require("../middlewares/validateMovie");

router.post("/create",userAuth,validateMovie, async(req, res) => {
    try {
        const { title,
            genre,
            director,
            year,
            actors,
            plot,
            runtime,
            rating,
            language,
            country } = req.body;
            const user = req.params.id;
            console.log("movie")
        const newMovie = new Movie({
            title,
            genre,
            director,
            year,
            actors,
            plot,
            runtime,
            rating,
            language,
            country,
            user
        });
        await newMovie.save();
        console.log("success");
        res.status(200).send({data : newMovie.title});
    } catch (err) {
        console.log(err);
        res.status(404).send({error:err})
    }
})

router.post("/update", (req, res) => {
    try {
        const newMovie = new Movie({ name: "stuff" });
        newMovie.save();
        console.log("success");
    } catch (err) {
        console.log(err);
    }
})

router.post("/delete", (req, res) => {
    try {
        const newMovie = new Movie({ name: "stuff" });
        newMovie.save();
        console.log("success");
    } catch (err) {
        console.log(err);
    }
})


module.exports = router;
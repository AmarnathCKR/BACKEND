const router = require("express").Router();
const { default: mongoose } = require("mongoose");
const Movie = require("../Database/movieSchema");
const userAuth = require("../middlewares/userAuth");
const validateMovie = require("../middlewares/validateMovie");
const User = require("../Database/userSchema");

router.post("/create", userAuth, validateMovie, async (req, res) => {
    try {
        const { title,
            genre,
            director,
            year,
            actors,
            plot,
            runtime,
            image,
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
            image,
            language,
            country,
            user
        });
        await newMovie.save();
        console.log("success");
        res.status(200).send({ data: newMovie.title });
    } catch (err) {
        console.log(err);
        res.status(404).send({ error: err })
    }
})

router.post("/update", userAuth, validateMovie, async (req, res) => {
    try {
        const { title,
            genre,
            director,
            year,
            actors,
            plot,
            runtime,
            image,
            language,
            country, id } = req.body;
        const user = req.params.id;

        Movie.findByIdAndUpdate({ _id: id }, {
            title,
            genre,
            director,
            year,
            actors,
            plot,
            runtime,
            image,
            language,
            country
        }).then((result) => {

            res.status(200).send({ data: result.title });
        }).catch((err) => {
            res.status(404).send({ error: err })
        })


    } catch (err) {
        console.log(err);
        res.status(404).send({ error: err })
    }
})

router.get("/fetch", userAuth, async (req, res) => {

    const { id } = req.params;
    await Movie.find({ user: new mongoose.Types.ObjectId(id) })
        .then((result) => {
            console.log(result);
            res.status(200).send({ data: result });
        }).catch((err) => {
            res.status(400).send({ error: "no data found" })
        })


})

router.get("/delete", userAuth, (req, res) => {
    try {
        Movie.findByIdAndDelete({ _id: req.query.movie }).then((result => {
            res.status(200).send({ data: "success" });
        })).catch((err) => {
            res.status(400).send({ error: err })
        })

    } catch (err) {
        res.status(400).send({ error: err })
    }
})

router.get("/all", async (req, res) => {
    const itemsPerPage = parseInt(req.query.itemsPerPage) || 10;
    const currentPage = parseInt(req.query.currentPage) || 1;
    const sortBy = req.query.sortBy || 'title';
    const sortOrder = 1; // Ascending order

    const query = {};

    if (req.query.search) {
        query.$or = [
            { title: { $regex: req.query.search, $options: 'i' } },
            { genre: { $regex: req.query.search, $options: 'i' } },
            { director: { $regex: req.query.search, $options: 'i' } },
            { plot: { $regex: req.query.search, $options: 'i' } },
            { year: { $regex: req.query.search, $options: 'i' } },
        ];
    }

    if (req.query.genreFilter) {
        query.genre = req.query.genreFilter;
    }

    if (req.query.yearFilter) {
        query.year = req.query.yearFilter;
    }

    try {
        const totalItems = await Movie.countDocuments(query);

        const skip = (currentPage - 1) * itemsPerPage;

        const movies = await Movie.find(query)
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(itemsPerPage);

        const genre = await Movie.distinct("genre");
        const year = await Movie.distinct("year");

        res.json({
            movies,
            currentPage,
            itemsPerPage,
            totalItems,
            genre,
            year
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get("/details", async (req, res) => {
    console.log(req.query.movie)
    if (req.query.movie !== null) {
        const movies = await Movie.findOne({ _id: req.query.movie });
        if (movies) {
            return res.status(200).send(movies);
        }
    }

    return res.status(404).send({ error: "invalid query" });
})

router.get("/details/auth", userAuth, async (req, res) => {
    const { id } = req.params;
    if (req.query.movie !== null) {
        const movies = await Movie.findOne({ _id: req.query.movie });

        if (movies) {
            const status = await User.findOne({ _id: id, watchlist: { $in: [req.query.id] } });
            console.log(status);
            const exist = !!status;
            if (exist) return res.status(200).send({ movie: movies, owned: true });
            return res.status(200).send({ movie: movies, owned: false });
        }
    }

    return res.status(404).send({ error: "invalid query" });
})

router.get("/watchlist", userAuth, async (req, res) => {
    const { id } = req.params;
    const { movie } = req.query;
    if (movie) {
        User.updateOne(
            { _id: id },
            { $push: { watchlist: movie } }
        ).then((result) => {
            return res.status(200).send(result);
        }).catch((err) => {
            return res.status(404).send({ error: "invalid query" });
        })
    } else {
        return res.status(404).send({ error: "invalid query" });
    }
})

router.get("/watchlist-remove", userAuth, async (req, res) => {
    const { id } = req.params;
    const { movie } = req.query;
    if (movie) {
        const status = await User.updateOne(
            { _id: id },
            { $pull: { watchlist: movie } }
        );
        return res.status(200).send({ watch: status });

    } else {
        return res.status(404).send({ error: "invalid query" });
    }
})


module.exports = router;
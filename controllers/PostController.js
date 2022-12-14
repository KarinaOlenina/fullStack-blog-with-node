import PostModel from '../models/Post.js';

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').exec();

        res.json(posts);

    } catch (err) {
        console.log(err + "Failed to retrieve all articles (×﹏×)")
        res.status(500).json({
            message: "Failed to retrieve all articles (×﹏×)"
        });
    }
};

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const tags = posts
            .map(obj => obj.tags)
            .flat()
            .slice(0, 5);

        res.json(tags);

    } catch (err) {
        console.log(err + "Failed to retrieve last tags (×﹏×)")
        res.status(500).json({
            message: "Failed to retrieve last tags (×﹏×)"
        });
    }
};

export const getByTags = async (req, res) => {
    try {

        const tags = req.params.tag
        const posts = await PostModel.find({tags : tags}).populate('author').exec();

        res.json(posts);

    } catch (err) {
        console.log(err + "Failed to retrieve last tags (×﹏×)")
        res.status(500).json({
            message: "Failed to retrieve last tags (×﹏×)"
        });
    }
};
export const getNewPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({createdAt: -1}).populate('author').exec();

        res.json(posts);

    } catch (err) {
        console.log(err + "Failed to retrieve last tags (×﹏×)")
        res.status(500).json({
            message: "Failed to retrieve last tags (×﹏×)"
        });
    }
};
export const getMostPopularPosts = async (req, res) => {
    try {
        const posts = await PostModel.find().sort({viewsCount: -1}).populate('author').exec();

        res.json(posts);

    } catch (err) {
        console.log(err + "Failed to retrieve last tags (×﹏×)")
        res.status(500).json({
            message: "Failed to retrieve last tags (×﹏×)"
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate({
                _id: postId,
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: 'after',
            },
            (err, doc) => {
                if (err) {
                    console.log(err + "Failed to retrieve one articles (×﹏×)")
                    return res.status(500).json({
                        message: "Failed to retrieve one articles (×﹏×)"
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Failed to retrieve one articles (×﹏×)",
                    })
                }

                res.json(doc);
            }
        ).populate('author');
    } catch (err) {
        console.log(err + "Failed to retrieve all articles (×﹏×)")
        res.status(500).json({
            message: "Failed to retrieve all articles (×﹏×)"
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
                _id: postId
            },
            (err, doc) => {
                if (err) {
                    console.log(err + "Failed to delete article (×﹏×)")
                    return res.status(500).json({
                        message: "Failed to delete article (×﹏×)"
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: "Article not found (×﹏×)",
                    });
                }

                res.json({
                    success: true,
                });
            }
        )
    } catch (err) {
        console.log(err + "Failed to retrieve all articles (×﹏×)")
        res.status(500).json({
            message: "Failed to retrieve all articles (×﹏×)"
        });
    }
}

export const createPost = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            author: req.userId,
        });

        const post = await doc.save();

        res.status(201).json(post);

    } catch (err) {
        console.log(err + "Failed to create article (×﹏×)")
        res.status(500).json({
            message: "Failed to create article (×﹏×)"
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.updateOne({
                _id: postId,
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags.split(','),
                author: req.userId,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err + "Failed to update article (×﹏×)")
        res.status(500).json({
            message: "Failed to update article (×﹏×)"
        });
    }
}
const Note = require('../modals/Note');

const getAllNotes = async (req, res, next) => {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(
            Math.max(parseInt(req.query.page) || 10, 1),
            100
        )
        const skip = (page - 1) * limit;
        const [notes, totalNotes] = await Promise.all([
            Note.find({ user: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            Note.countDocuments({
                user: userId
            })
        ]);
        const totalpages = Math.ceil(totalNotes / limit);
        return res.status(200).json({
            data: notes,
            pagintation: {
                page,
                limit,
                totalItems: totalNotes,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        })
    } catch (error) {
        next(error);
    }
}

const getNote = async (req, res, next) => {
    try {
        const note = await Note.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json(note);
    } catch (error) {
        next(error);
    }
};

const createNote = async (req, res, next) => {
    try {
        const { title, content } = req.body;

        const note = await Note.create({
            user: req.userId,
            title,
            content
        });

        return res.status(201).json(note);
    } catch (error) {
        next(error);
    }
};

const updateNote = async (req, res, next) => {
    try {
        const { title, content, completed } = req.body;
        const note = await Note.create({
            _id: req.params.id,
            user: req.userId,
        })

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }
        if (title !== undefined) note.title = title;
        if (content !== undefined) note.content = content;
        if (completed !== undefined) note.completed = completed;

        await note.save();

        return res.status(200).json(note);
    } catch (error) {
        next(error);
    }
}

const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            message: "Note deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
};
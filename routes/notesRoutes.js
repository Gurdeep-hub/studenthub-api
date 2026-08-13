const express = require("express");
const router = express.Router();

const verifyJWT = require("../middleware/verifyJwt");

const validate = require("../middleware/validate");

const {
    createNoteSchema,
    updateNoteSchema
} = require("../validator/notesValidator");

const {
    getAllNotes,
    getNote,
    createNote,
    updateNote,
    deleteNote
} = require("../controllers/noteController");

router.use(verifyJWT);
router
    .route("/")
    .get(getAllNotes)
    .post(validate(createNoteSchema), createNote);

router
    .route("/:id")
    .get(getNote)
    .put(validate(updateNoteSchema), updateNote)
    .delete(deleteNote);

module.exports = router;
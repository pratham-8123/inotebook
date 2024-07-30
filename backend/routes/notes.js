import express from 'express';
import fetchuser from '../middleware/fetchuser.js';
import Note from '../models/Note.js';
import { body, validationResult } from 'express-validator';


const router = express.Router();

// Route 1 : Get all notes for the logged in user : GET "/api/notes/getallnotes". Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// Route 2 : Add a new note : POST "/api/notes/addnote". Login Required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description should be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        // if there are errors, return bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;
        const note = new Note({
            title, description, tag, user: req.user.id
        });
        const savedNote = await note.save();
        res.send(savedNote);

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// Route 3 : Update an exiting note : PUT "/api/notes/updatenote". Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // Create a new note object
        const newNote = {};
        if (title) { newNote.title = title; }
        if (description) { newNote.description = description; }
        if (tag) { newNote.tag = tag; }

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found!");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        return res.json({ note });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

// Route 4 : Delete a Note : DELETE "/api/notes/deletenote". Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be deleted and delete it
        let note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).send("Note not found!");
        }
        //Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        return res.json({ "message" : "Note deleted successfully!" });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send("Internal Server Error");
    }
});

export default router;
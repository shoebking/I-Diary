const express=require('express')
const Note=require('../models/Notes');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const fetchUser=require('../middleware/fetchUser')

//Router-1
router.get("/fetchallNotes",fetchUser,async (req,res)=>{
    try{
        const notes=await Note.find({user:req.user.id});
        res.json(notes);
    }catch(err){
        console.log(err.message);
        res.status(500).send("Internal server Error")
    }
})

//Route -2
router.post("/addNotes",fetchUser,[
    body('title',"Enter valid Title").isLength({min:3}),
    body('description',"Description must of 5 characters").isLength({min:5}),
    body('tag',"Tag must of 5 characters").isLength({min:5})
],async (req,res)=>{
    try{
        const { title, description, tag } = req.body;

            // If there are errors, return Bad request and the errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const note = new Note({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save()

            res.json(savedNote)
    }
    catch(err){
        console.log(err.message);
        res.status(500).send("Internal server Error")
    }
})

// Router-3

router.put("/updatenotes/:id",fetchUser,async (req,res)=>{
    const {title , description , tag}=req.body;
    try{
        const newNote={};
        if(title){newNote.title=title};
        if(description){newNote.description=description};
        if(tag){newNote.tag=tag};
        let note=await Note.findById(req.params.id);
        if(!note){
            res.status(404).send("Not Found")
        }
        if(note.user.toString() !== req.user.id){
            res.status(401).send("Unauthorized Access")
        }

        note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
        res.send({note})

    }catch(err){
        console.log(err.message);
        res.status(500).send("Internal server Error")
    }
})

// Router-4

router.delete("/deletenotes/:id",fetchUser,async (req,res)=>{
    try {
        // Find the note to be delete and delete it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") }

        // Allow deletion only if user owns this Note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been deleted", note: note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


module.exports=router;

const express=require('express');
var fetchuser = require('../middleware/fetchuser');
const router= express.Router();
const Notes= require('../models/Notes')
const {body, validationResult} = require('express-validator')

//ROUTE 1: Get all the notes using: GET "api/auth/getuser". Login required.
router.get('/fetchallnotes', fetchuser, async(req, res)=>{
    try{
        const notes=await Notes.find({user: req.user.id});
        res.json(notes)
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})


//ROUTE 2: Add a new Note using: POST "/api/notes/addnotes". Login Required.
router.post('/addnotes', fetchuser,[
    body('title',"Enter a Valid title").isLength({min:3}),
    body('description',"Description must be of atleast 5 characters").isLength({min:5}),
], async(req, res)=>{
    try{
        const {title, description, tag}= req.body;//destructuring

    // If there are errors, return bad request and the errors
        const errors= validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors:errors.array()});
        }

        const note= new Notes({
                title, description, tag, user: req.user.id
        })
        const saveNote= await note.save()
        res.json(saveNote)
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }   
})

//ROUTE 3: Update a note using: PUT "api/auth/updatenote".Login Required.
router.put('/update/:id', fetchuser, async(req, res)=>{
    try{
        const {title, description, tag}= req.body;
    // Create a newNote object
        const newNote={};
        if(title){newNote.title= title};
        if(description){newNote.description= description};
        if(tag){newNote.tag= tag};

        // Find the note to be updated and update it
        let note=await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}

        // note.user.toString() will giver user id
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
})


//ROUTE 4: Delete a note using: Delete "api/auth/deletenote".Login Required.

router.delete('/deletenote/:id', fetchuser, async(req, res)=>{
    try{
        // Find the note to be delete and delete it
        let note=await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not Found")}
    
        // Allow deletion only if user owns this Note
        // note.user.toString() will giver user id
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }
    
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success":"Note has been deleted",note: note});
    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
   
})

module.exports= router


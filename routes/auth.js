const express=require('express');
const router= express.Router();
const User= require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser')

const jwt_secret='Manisha@1234';

//Route1: Create a User using: POST "/api/auth/createuser". No login required.
router.post('/createuser', [
    body('name', 'Enter a Name of minLength 3').isLength({min: 3}),
    body('email','Enter a valid Email' ).isEmail(),
    body('password',"Password must be of 5 characters").isLength({min: 5}),
],
    async (req, res)=>{
//________________________________________________________
    // console.log(req.body)//it will print the content writen in body in console

    // res.send(req.body)//to print the response
    // const user=User(req.body)//It will create a user based on the data given in the body

    // user.save()//will save the user in mongoDB
//__________________________________________________

// If there are errors, return bad request and the errors.
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }


   
    try{
         // Check whether the user with this email exists already
        let user=await User.findOne({email: req.body.email});
        if(user){
            return res.status(400).json({error: "Sorry a user with this email already exists"})
        }

        const salt = await bcrypt.genSalt(10);//await will stop the flow untill promise is resolved.
        const secPass = await bcrypt.hash(req.body.password, salt);

        //Create a new user
        user=await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
        })

        const data={
            user:{
                id:user.id
            }
        }
        const authToken=jwt.sign(data, jwt_secret);//by using jwt_secret we can check if someone has changed the data or not

        // console.log(authtoken);

        res.json({authToken})
    }
    catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }
})
//__________________________________________________________________________________________________________

//Route2: Authenticate a User using: POST "/api/auth/login". No login required.
router.post('/login', [
    body('email', 'Enter a valid Email' ).isEmail(),
    body("password", "Password can't be blank").notEmpty()
],async(req, res)=>{
    const errors=  validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
   

    const {email, password} = req.body;
    try{
        let user= await User.findOne({email});
        if(!user){
            return res.status(400).json({error: "Please try to login with correct credentials"})                 
        }


        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password valid: ${isPasswordValid}`);



        if(!isPasswordValid){
            return res.status(400).json({error: "Please try to login with correct credentials"})
        }

        

       
        const data= {
            user:{
                id: user.id
            }
        };

        const authToken=jwt.sign(data, jwt_secret);
        res.json({authToken})
        

       
    }catch(error){
        console.log(error.message)
        res.status(500).send("Internal server error")
    }    
})
//__________________________________________________________________________________________________________

//Route3: Will give logedin user details. will require login
// router.post('/getuser', fetchuser, async(req,res)=>{
//     try{
//         userId=req.user.id;
//         const user= await User.findById(userId).select("-password")
//         res.send(user)
//     }catch(error){
//         console.log(error.message);
//         res.status(500).send("Intenal server error");
//     }
// })

router.post('/getuser', fetchuser, async(req, res)=>{
    try{
        const userId=req.user.id;
        const user= await User.findById(userId).select("-password")
        res.send(user)

    }catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
    


module.exports= router

const mongoose= require('mongoose');
const mongoURI="mongodb://localhost:27017/inotebook"

// The connect function no longer accept call backs but async await.

// const connectToMongo=()=>{
    // moongoose.connect(mongoURI, ()=>{
    //     console.log("Connected to MongoDB Successfully");
    // })
// }
    async function connectToMongo() {
        await mongoose.connect(mongoURI).then(()=> console.log("Connected to Mongo Successfully")).catch(err => console.log(err));
    }


module.exports=connectToMongo;
import mongoose from "mongoose";

let connectDB=async()=>{
    try{
        await mongoose.connect(process.env.URL);
        console.log("mongoDB connected succesfully..");
    }
    catch(e){
        console.log(`Error occured is ${e}`)
    }
}

export default connectDB;
import mongoose from 'mongoose';

export async function connectDB(){
   try{
    mongoose.set('strictQuery',true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");
   }catch(err){
    console.error('Connection error: ',err.message);
    process.exit(1);
   }
}
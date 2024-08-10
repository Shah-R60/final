import mongoose from "mongoose";
import{DB_NAME} from "../constants.js"

const connectDB = async()=>
{
    try{
      const conneinst = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
               console.log(`\nMongoDB Connected!! DB HOST:${conneinst.connection.host}`);
    }catch(error)
    {
        console.log("MONGODB connection failed",error)
        process(1)
    }
}

export default connectDB;
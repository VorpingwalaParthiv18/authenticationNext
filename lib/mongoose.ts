import mongoose from "mongoose";

const mongodbConnection = process.env.MONGODB_URI!

if (!mongodbConnection) {
    throw new Error("MONGODB_URI is not defined in environment variables");
}

let cached = (global as any).mongoose

if(!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null }
}

 async function dbConnect(){
    if(cached.conn){
        return cached.conn;
    }
    cached.promise = mongoose.connect(mongodbConnection).then((mongoose) => {
        return mongoose;
    });
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;
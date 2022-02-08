import { MongoClient } from 'mongodb';


export async function connectToDb(from, to, day, limit) {

    //connect uri to locale machine
    const uri = "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false";

    //get connection client
    const client = new MongoClient(uri);

    try {
        //connect to database
        return client.connect();

    }
    catch (err) {
        console.log(err);
    }
}




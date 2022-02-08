import express from "express"
import { connectToDb } from './connectToDB.js'
import { getClientsWithLessVisits } from './printClientsWithEachVisits.js';
import { piplineWatchVisits } from './pipelines/piplineWatchVisits.js';
import NodeCache from "node-cache"
const myCache = new NodeCache();
const app = express();

app.use(express.json());

app.get("/less-visited-clients-per-day", (req, res) => {
    const from = parseInt(req.query.from);
    const to = parseInt(req.query.to);
    const day = req.query.day;

    //limit param has been added to know how many customers should i get from the least visits customers
    //after discusion with mester mohammed khamis
    // if its not sent it will have a default value of 30
    const limit = req.query.limit || 30;

    async function returnresult(from, to, day, limit) {
        let client;
        try {
            let ClientsWithLessVisits
            //connect to database

            client = await connectToDb(from, to, day, limit);
            //check if cache is empty

            if (!myCache.get("apiresult")) {
                //if its empty get the data from db
                ClientsWithLessVisits = await getClientsWithLessVisits(client, from, to, day, limit);
                let ClientsWithLessVisitsobj = { 'clientNames': ClientsWithLessVisits }
                //put data in cache
                myCache.set("apiresult", ClientsWithLessVisitsobj)
            }

            //if no changes happened to the database get data from cache
            if (!await funcWatchClientsWithLessVisits()) {
                //return data from cache
                let apiresultVar = myCache.get("apiresult")
                ClientsWithLessVisits = apiresultVar;
            }

            //sent it as response through the api
            res.status(200).send(ClientsWithLessVisits);
        }

        catch (error) {
            console.log(error);
            res.status(500).send("internal server error")
        }
        finally {
            if (client) {
                client.close()
            }
        }
    }

    async function funcWatchClientsWithLessVisits() {
        try {
            //create new client that will be opened while the app running
            //connect to db
            let client = await connectToDb();
            let visitCollectionFlag = false;
            let clientCollectionFlag = false;

            //connect to specific collection to wach it
            const visitCollection = client.db("mongoTask").collection("visit")

            //watch the visit collection depending on the corresponding pipeline 
            const visitChangeStream = visitCollection.watch(piplineWatchVisits);

            //i couldnt test this part because i was not able to change my locale mongodb to replicaset
            visitChangeStream.on('change', (next) => {
                //set flag to true if any change happened
                visitCollectionFlag = true;
            });

            //connect to specific collection to wach it
            const clientCollection = client.db("mongoTask").collection("client")

            //watch the visit collection depending on the corresponding pipeline 
            const clientChangeStream = clientCollection.watch();

            //i couldnt test this part because i was not able to change my locale mongodb to replicaset
            clientChangeStream.on('change', (next) => {
                //set flag to true if any change happened
                clientCollectionFlag = true;
            });

            if (visitCollectionFlag || clientCollectionFlag) {
                return true
            } else {
                return false
            }



        }
        catch (error) {
            //the application will work but will always print a message that watch stream 
            //need replica set to work.
            console.log(error);
        }


    }
    returnresult(from, to, day, limit);
});




const port = process.env.PORT || 3050;
app.listen(port, () => { console.log(`app running in port ${port}`) })
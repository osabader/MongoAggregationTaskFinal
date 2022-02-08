
import { piplineLessVisits } from './pipelines/piplineLessVisits.js';

export async function getClientsWithLessVisits(client, from, to, day, limit) {

    //return date from mongo depending on the aggregate pipeline
    const aggCursor = client.db("mongoTask").collection("visit").aggregate(piplineLessVisits(from, to, day, limit));

    //fill the array with the result and return it
    let result = [];
    await aggCursor.forEach(element => {
        result.push(element.clientname[0].name);
    });
    return result;
} 
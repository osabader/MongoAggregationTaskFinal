
export function piplineWatchVisits() {
    const piplineWatchVisits = [
        {
            '$project': {

                'client': 1,
                'time': 1,
                'user':1
            }
        }
    ];
    return piplineWatchVisits;
}
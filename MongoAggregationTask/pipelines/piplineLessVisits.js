
export function piplineLessVisits(from, to, day, limit) {
    const piplineLessVisits = [
        {
            '$match': {
                '$and': [
                    {
                        'time': {
                            '$gte': from
                        }
                    }, {
                        'time': {
                            '$lte': to
                        }
                    }
                ]
            }
        }, {
            '$project': {
                'client': 1,
                'user': 1,
                'time': 1,
                'date': {
                    '$toDate': '$time'
                }
            }
        }, {
            '$project': {
                'client': 1,
                'user': 1,
                'time': 1,
                'day': {
                    '$dayOfWeek': {
                        'date': '$date'
                    }
                }
            }
        }, {
            '$project': {
                'client': 1,
                'user': 1,
                'time': 1,
                'dayname': {
                    '$switch': {
                        'branches': [
                            {
                                'case': {
                                    '$eq': [
                                        '$day', 1
                                    ]
                                },
                                'then': 'sunday'
                            }, {
                                'case': {
                                    '$eq': [
                                        '$day', 2
                                    ]
                                },
                                'then': 'monday'
                            }, {
                                'case': {
                                    '$eq': [
                                        '$day', 3
                                    ]
                                },
                                'then': 'tueday'
                            }, {
                                'case': {
                                    '$eq': [
                                        '$day', 4
                                    ]
                                },
                                'then': 'wednsday'
                            }, {
                                'case': {
                                    '$eq': [
                                        '$day', 5
                                    ]
                                },
                                'then': 'thursday'
                            }, {
                                'case': {
                                    '$eq': [
                                        '$day', 6
                                    ]
                                },
                                'then': 'friday'
                            }
                        ],
                        'default': 'incorrectDay'
                    }
                }
            }
        }, {
            '$project': {
                'client': 1,
                'user': 1,
                'time': 1,
                'visitsondayselected': {
                    '$eq': [
                        '$dayname', day
                    ]
                }
            }
        }, {
            '$project': {
                '_id': 1,
                'client': 1,
                'visitsondayselected': {
                    '$cond': {
                        'if': {
                            '$eq': [
                                '$visitsondayselected', true
                            ]
                        },
                        'then': 1,
                        'else': 0
                    }
                }
            }
        }, {
            '$group': {
                '_id': '$client',
                'countvisitsondayselected': {
                    '$sum': '$visitsondayselected'
                }
            }
        }, {
            '$sort': {
                'countvisitsondayselected': 1
            }
        }, {
            '$limit': limit
        }, {
            '$lookup': {
                'from': 'client',
                'localField': '_id',
                'foreignField': '_id',
                'as': 'clientname'
            }
        }
    ];
    return piplineLessVisits;
}
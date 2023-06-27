import { gql } from '@apollo/client';

export const FETCH_DATA = gql`
    query fetchdata($id: ID) {
        workouts(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    workouttitle
                    intensity
                    level
                    updatedAt
                    About
                    Benifits
                    workout_URL
                    Workout_Video_ID
                    workout_text
                    warmup
                    cooldown
                    mainmovement
                    calories
                    users_permissions_user {
                        data {
                            id
                        }
                    }
                    fitnessdisciplines {
                        data {
                            id
                            attributes {
                                disciplinename
                            }
                        }
                    }
                    muscle_groups {
                        data {
                            id
                            attributes {
                                name
                            }
                        }
                    }
                    equipment_lists {
                        data {
                            id
                            attributes {
                                updatedAt
                                name
                            }
                        }
                    }
                }
            }
        }
        fitnessdisciplines(sort: ["updatedAt"]) {
            data {
                id
                attributes {
                    disciplinename
                    updatedAt
                }
            }
        }
    }
`;

export const FETCH_FITNESS_PROGRAMS = gql`
    query checkSessionQuery($id: ID) {
        fitnessprograms(filters: { sessions: { workout: { id: { eq: $id } } } }) {
            data {
                id
                attributes {
                    title
                }
            }
        }

        tags(filters: { sessions: { workout: { id: { eq: $id } } } }) {
            data {
                id
                attributes {
                    tag_name
                }
            }
        }
    }
`;

export const FETCH_FITNESSDISCPLINES = gql`
    query fitnessdiscplines {
        fitnessdisciplines(sort: ["updatedAt"]) {
            data {
                id
                attributes {
                    disciplinename
                    updatedAt
                }
            }
        }
    }
`;

export const GET_TABLEDATA = gql`
    query fetchdata($id: ID, $filter: String!, $start: Int, $limit: Int) {
        workouts(
            filters: {
                users_permissions_user: { id: { eq: $id } }
                workouttitle: { containsi: $filter }
            }
            pagination: { start: $start, limit: $limit }
            sort: ["updatedAt:desc"]
        ) {
            meta {
                pagination {
                    pageCount
                    total
                }
            }
            data {
                id
                attributes {
                    workouttitle
                    intensity
                    level
                    updatedAt
                    About
                    Benifits
                    workout_URL
                    Workout_Video_ID
                    workout_text
                    warmup
                    cooldown
                    mainmovement
                    calories
                    users_permissions_user {
                        data {
                            id
                        }
                    }
                    fitnessdisciplines {
                        data {
                            id
                            attributes {
                                disciplinename
                            }
                        }
                    }
                    muscle_groups {
                        data {
                            id
                            attributes {
                                name
                            }
                        }
                    }
                    equipment_lists {
                        data {
                            id
                            attributes {
                                updatedAt
                                name
                            }
                        }
                    }
                }
            }
        }
        fitnessdisciplines(sort: ["updatedAt"]) {
            data {
                id
                attributes {
                    disciplinename
                    updatedAt
                }
            }
        }
    }
`;

export const CREATE_WORKOUT = gql`
    mutation createworkout(
        $workouttitle: String
        $intensity: ENUM_WORKOUT_INTENSITY
        $level: ENUM_WORKOUT_LEVEL
        $About: String
        $Benifits: String
        $users_permissions_user: ID!
        $calories: Int
        $fitnessdisciplines: [ID]
        $equipment_lists: [ID]
        $muscle_groups: [ID]
        $workout_URL: String
        $workout_text: String
        $warmup: JSON
        $mainmovement: JSON
        $cooldown: JSON
        $Workout_Video_ID: String
    ) {
        createWorkout(
            data: {
                workouttitle: $workouttitle
                intensity: $intensity
                level: $level
                About: $About
                Benifits: $Benifits
                users_permissions_user: $users_permissions_user
                equipment_lists: $equipment_lists
                fitnessdisciplines: $fitnessdisciplines
                muscle_groups: $muscle_groups
                workout_URL: $workout_URL
                workout_text: $workout_text
                calories: $calories
                warmup: $warmup
                mainmovement: $mainmovement
                cooldown: $cooldown
                Workout_Video_ID: $Workout_Video_ID
            }
        ) {
            data {
                id
                attributes {
                    workouttitle
                }
            }
        }
    }
`;

export const UPDATE_WORKOUT = gql`
    mutation updateworkout(
        $workouttitle: String
        $intensity: ENUM_WORKOUT_INTENSITY
        $level: ENUM_WORKOUT_LEVEL
        $About: String
        $Benifits: String
        $users_permissions_user: ID!
        $calories: Int
        $fitnessdisciplines: [ID]
        $equipment_lists: [ID]
        $muscle_groups: [ID]
        $workout_URL: String
        $workout_text: String
        $workoutid: ID!
        $warmup: JSON
        $mainmovement: JSON
        $cooldown: JSON
        $Workout_Video_ID: String
    ) {
        updateWorkout(
            id: $workoutid
            data: {
                workouttitle: $workouttitle
                intensity: $intensity
                level: $level
                About: $About
                Benifits: $Benifits
                users_permissions_user: $users_permissions_user
                calories: $calories
                fitnessdisciplines: $fitnessdisciplines
                equipment_lists: $equipment_lists
                muscle_groups: $muscle_groups
                workout_URL: $workout_URL
                workout_text: $workout_text
                warmup: $warmup
                mainmovement: $mainmovement
                cooldown: $cooldown
                Workout_Video_ID: $Workout_Video_ID
            }
        ) {
            data {
                id
                attributes {
                    workouttitle
                }
            }
        }
    }
`;

export const DELETE_WORKOUT = gql`
    mutation deleteworkout($id: ID!) {
        deleteWorkout(id: $id) {
            data {
                id
                attributes {
                    workouttitle
                }
            }
        }
    }
`;

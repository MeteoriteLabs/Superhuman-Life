import { gql } from '@apollo/client';

export const FETCH_DATA = gql`
    query fetchdata($id: ID) {
        exercises(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    updatedAt
                    exercisename
                    exerciselevel
                    exerciseminidescription
                    exercisetext
                    exerciseurl
                    exerciseupload
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
                    equipment_lists {
                        data {
                            id
                            attributes {
                                updatedAt
                                name
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
                }
            }
        }
    }
`;

export const FETCH_WORKOUTS = gql`
    query fetchworkouts($id: ID!) {
        workouts(
            filters: { users_permissions_user: { id: { eq: $id } } }
            pagination: { pageSize: 100 }
        ) {
            data {
                id
                attributes {
                    warmup
                    mainmovement
                    cooldown
                    workouttitle
                }
            }
        }
    }
`;

export const GET_EXERCISELIST = gql`
    query exercisesList($id: ID!, $filter: String!) {
        exercises(
            filters: {
                users_permissions_user: { id: { eq: $id } }
                exercisename: { containsi: $filter }
            }
        ) {
            data {
                id
                attributes {
                    exercisename
                    users_permissions_user {
                        data {
                            id
                        }
                    }
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
    query ExercisesQuery($id: ID!, $filter: String!, $start: Int, $limit: Int) {
        exercises(
            pagination: { start: $start, limit: $limit }
            filters: {
                users_permissions_user: { id: { eq: $id } }
                exercisename: { containsi: $filter }
            }
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
                    updatedAt
                    exercisename
                    exerciselevel
                    exercisetext
                    exerciseurl
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
                    equipment_lists {
                        data {
                            id
                            attributes {
                                updatedAt
                                name
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
                }
            }
        }
    }
`;

export const CREATE_EXERCISE = gql`
    mutation createexercise(
        $exercisename: String
        $exerciselevel: ENUM_EXERCISE_EXERCISELEVEL
        $exerciseminidescription: String
        $exercisetext: String
        $exerciseurl: String
        $fitnessdisciplines: [ID]
        $users_permissions_user: ID!
        $equipment_lists: [ID]
        $exercisemusclegroups: [ID]
        $exerciseupload: String
    ) {
        createExercise(
            data: {
                exercisename: $exercisename
                exerciselevel: $exerciselevel
                exerciseminidescription: $exerciseminidescription
                exercisetext: $exercisetext
                exerciseurl: $exerciseurl
                users_permissions_user: $users_permissions_user
                fitnessdisciplines: $fitnessdisciplines
                equipment_lists: $equipment_lists
                muscle_groups: $exercisemusclegroups
                exerciseupload: $exerciseupload
            }
        ) {
            data {
                id
                attributes {
                    exercisename
                }
            }
        }
    }
`;

export const UPDATE_EXERCISE = gql`
    mutation updateexercise(
        $exercisename: String
        $exerciselevel: ENUM_EXERCISE_EXERCISELEVEL
        $exerciseminidescription: String
        $exercisetext: String
        $exerciseurl: String
        $fitnessdisciplines: [ID]
        $users_permissions_user: ID!
        $equipment_lists: [ID]
        $exercisemusclegroups: [ID]
        $exerciseid: ID!
        $exerciseupload: String
    ) {
        updateExercise(
            id: $exerciseid
            data: {
                exercisename: $exercisename
                exerciselevel: $exerciselevel
                exerciseminidescription: $exerciseminidescription
                exercisetext: $exercisetext
                exerciseurl: $exerciseurl
                users_permissions_user: $users_permissions_user
                fitnessdisciplines: $fitnessdisciplines
                equipment_lists: $equipment_lists
                muscle_groups: $exercisemusclegroups
                exerciseupload: $exerciseupload
            }
        ) {
            data {
                id
                attributes {
                    exercisename
                }
            }
        }
    }
`;

export const DELETE_EXERCISE = gql`
    mutation deleteexercise($id: ID!) {
        deleteExercise(id: $id) {
            data {
                id
                attributes {
                    exercisename
                }
            }
        }
    }
`;

import { gql } from '@apollo/client';

export const ADD_GOAL = gql`
    mutation addgoal(
        $goals: [ID]
        $assignedBy: [ID]
        $start: Date!
        $end: Date
        $users_permissions_user: ID
    ) {
        createUserGoal(
            input: {
                data: {
                    goals: $goals
                    assignedBy: $assignedBy
                    start: $start
                    end: $end
                    users_permissions_user: $users_permissions_user
                }
            }
        ) {
            userGoal {
                id
            }
        }
    }
`;

export const ADD_GOAL_NEW = gql`
    mutation addgoal(
        $goals: [ID]
        $assignedBy: [ID]
        $start: Date!
        $end: Date
        $users_permissions_user: ID
    ) {
        createUserGoal(
            data: {
                goals: $goals
                assigned_by: $assignedBy
                start: $start
                end: $end
                users_permissions_user: $users_permissions_user
            }
        ) {
            data {
                id
            }
        }
    }
`;

export const GET_GOALS = gql`
    query getGoals($id: ID) {
        userGoals(sort: "updatedAt:desc", where: { users_permissions_user: $id }) {
            id
            start
            end
            goals {
                id
                name
            }
            assignedBy {
                id
                username
            }
            updatedAt
        }
    }
`;

export const GET_GOALS_NEW = gql`
    query getGoals($id: ID) {
        userGoals(filters: { users_permissions_user: { id: { eq: $id } } }) {
            data {
                id
                attributes {
                    start
                    end
                    goals {
                        data {
                            id
                            attributes {
                                name
                            }
                        }
                    }
                    assigned_by {
                        data {
                            id
                            attributes {
                                username
                            }
                        }
                    }
                    updatedAt
                }
            }
        }
    }
`;

export const GET_GOALS_DETAILS = gql`
    query getGoals($id: ID) {
        userGoals(where: { id: $id }) {
            id
            start
            end
            goals {
                id
                name
            }
            assignedBy {
                id
                username
            }
            updatedAt
        }
    }
`;

export const GET_GOALS_DETAILS_NEW = gql`
    query getGoals($id: ID) {
        userGoals(filters: { id: { eq: $id } }) {
            data {
                id
                attributes {
                    start
                    end
                    goals {
                        data {
                            id
                            attributes {
                                name
                            }
                        }
                    }
                    assigned_by {
                        data {
                            id
                            attributes {
                                username
                            }
                        }
                    }
                    updatedAt
                }
            }
        }
    }
`;

export const UPDATE_GOALS = gql`
    mutation updategoal(
        $goals: [ID]
        $assignedBy: [ID]
        $start: Date
        $end: Date
        $users_permissions_user: ID
        $messageid: ID!
    ) {
        updateUserGoal(
            input: {
                data: {
                    goals: $goals
                    assignedBy: $assignedBy
                    start: $start
                    end: $end
                    users_permissions_user: $users_permissions_user
                }
                where: { id: $messageid }
            }
        ) {
            userGoal {
                id
            }
        }
    }
`;

export const UPDATE_GOALS_NEW = gql`
    mutation updategoal(
        $goals: [ID]
        $assignedBy: [ID]
        $start: Date
        $end: Date
        $users_permissions_user: ID
        $messageid: ID!
    ) {
        updateUserGoal(
            id: $messageid
            data: {
                goals: $goals
                assigned_by: $assignedBy
                start: $start
                end: $end
                users_permissions_user: $users_permissions_user
            }
        ) {
            data {
                id
            }
        }
    }
`;

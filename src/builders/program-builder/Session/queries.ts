import { gql } from '@apollo/client';

export const GET_INDUSTRY_SESSIONS = gql`
    query industrySessions($id: ID, $start: Int, $limit: Int, $industryId: String) {
        industrySessions(
            filters: {industryId:{eq: $industryId}, users_permissions_user: {id: {eq: $id}}} 
            pagination: { start: $start, limit: $limit }
            
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
                    title
                    agenda
                    about
                    users_permissions_user {
                        data {
                            id
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
       
    }
`;

export const GET_INDUSTRY_SESSION = gql`
    query industrySession($id: ID!) {
        industrySession(
            id: $id
            
        ) {
           
            data {
                id
                attributes {
                    title
                    agenda
                    about
                    document
                    users_permissions_user {
                        data {
                            id
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
       
    }
`;

export const CREATE_INDUSTRY_SESSION = gql`
    mutation createIndustrySession($data: IndustrySessionInput!) {
        createIndustrySession(data: $data) {
            data {
                id
            }
        }
    }
`;

export const UPDATE_INDUSTRY_SESSION = gql`
    mutation createIndustrySession($id: ID!, $data: IndustrySessionInput!) {
        createIndustrySession(id: $id, data: $data) {
            data {
                id
            }
        }
    }
`;

export const DELETE_INDUSTRY_SESSION = gql`
    mutation deleteIndustrySession($id: ID!) {
        deleteIndustrySession(id: $id) {
            data {
                id
            }
        }
    }
`;



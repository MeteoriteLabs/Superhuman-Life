import { gql } from '@apollo/client';

export const GET_LEADS = gql`
    query getLeads($id: ID , $start: Int, $limit: Int) {
        websiteContactForms(
            pagination: { start: $start, limit: $limit }
            filters: { isSeen: { eq: false }, users_permissions_user: { id: { eq: $id } } }
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
                    isSeen
                    Details
                    updatedAt
                    users_permissions_user {
                        data {
                            id
                        }
                    }
                    createdAt
                }
            }
        }
    }
`;

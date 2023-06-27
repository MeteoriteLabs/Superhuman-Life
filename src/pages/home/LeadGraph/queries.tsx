import { gql } from '@apollo/client'

export const GET_LEADS = gql`
    query Forms($id: ID, $startDateTime: DateTime, $endDateTime: DateTime) {
        websiteContactForms(
            filters: {
                users_permissions_user: { id: { eq: $id } }
                createdAt: { gte: $startDateTime, lte: $endDateTime }
            }
        ) {
            data {
                id
                attributes {
                    createdAt
                }
            }
        }
    }
`

import { gql } from '@apollo/client'

export const GET_AVAILABILITY = gql`
    query changemakerAvailability($id: ID) {
        changemakerAvailabilties(
            sort: ["updatedAt:desc"]
            filters: { users_permissions_user: { id: { eq: $id } } }
        ) {
            data {
                id
                attributes {
                    updatedAt
                }
            }
        }
    }
`

export const BOOKING_CONFIG = gql`
    query bookingConfigs($id: ID!) {
        bookingConfigs(
            sort: ["updatedAt:desc"]
            filters: { fitnesspackage: { users_permissions_user: { id: { eq: $id } } } }
        ) {
            data {
                id
                attributes {
                    updatedAt
                }
            }
        }
    }
`

export const FETCH_USER_PROFILE_DATA = gql`
    query fetchUserProfileData($id: ID!) {
        usersPermissionsUser(id: $id) {
            data {
                id
                attributes {
                    updatedAt
                }
            }
        }
    }
`

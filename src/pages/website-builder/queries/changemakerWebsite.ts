import { gql } from '@apollo/client'

export const FETCH_USER_WEBSITE = gql`
    query WebsiteData($id: ID) {
        changemakerWebsites(filters: { users_permissions_user: { id: { eq: $id } } }) {
            data {
                id
                attributes {
                    subdomain
                    selectedTemplate
                    users_permissions_user {
                        data {
                            id
                            attributes {
                                username
                                email
                                provider
                                confirmed
                                blocked
                            }
                        }
                    }
                }
            }
        }
    }
`

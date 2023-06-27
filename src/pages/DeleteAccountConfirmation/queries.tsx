import { gql } from '@apollo/client'

export const FETCH_USER_PROFILE_DATA = gql`
    query fetchUserProfileData($id: ID!) {
        usersPermissionsUser(id: $id) {
            data {
                id
                attributes {
                    username
                    First_Name
                    Last_Name
                    email
                    Phone_Number
                    Photo_ID
                    About_User
                    Website_URL
                    about_mini_description
                    designations {
                        data {
                            id
                            attributes {
                                Designation_title
                                description
                            }
                        }
                    }
                    instagram_url
                    Facebook_URL
                    Youtube_URL
                    LinkedIn_URL
                    Clubhouse_URL
                    Twitter_URL
                    Verification_ID
                    Photo_profile_banner_ID
                    educational_details {
                        data {
                            id
                            attributes {
                                Institute_Name
                                Type_of_degree
                                Specialization
                                Year
                            }
                        }
                    }
                    addresses {
                        data {
                            id
                            attributes {
                                city
                                address1
                                address2
                                type
                                zipcode
                                country
                                state
                                Title
                                type_address
                                House_Number
                            }
                        }
                    }
                }
            }
        }
    }
`

export const UPDATE_USER_PROFILE_DATA = gql`
    mutation updateUserProfileData($id: ID!, $data: UsersPermissionsUserInput!) {
        updateUsersPermissionsUser(id: $id, data: $data) {
            data {
                attributes {
                    Phone_Number
                    First_Name
                    Last_Name
                    instagram_url
                    Facebook_URL
                    LinkedIn_URL
                    About_User
                }
            }
        }
    }
`

export const CREATE_DELETE_ACCOUNT = gql`
    mutation createDeleteAccount($data: DeleteAccountInput!) {
        createDeleteAccount(data: $data) {
            data {
                id
            }
        }
    }
`

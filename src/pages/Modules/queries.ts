import { gql } from '@apollo/client';

export const FETCH_INDUSTRIES = gql`
    query fetchIndustries {
        industries(pagination:{pageSize: 20}){
            data {
                id
                attributes {
                    IndustryName
                    designations {
                        data {
                            id
                            attributes {
                                Designation_title
                                description
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const UPDATE_USER_PROFILE_DATA = gql`
    mutation updateUserProfileData($id: ID!, $data: UsersPermissionsUserInput!) {
        updateUsersPermissionsUser(id: $id, data: $data) {
            data {
                id
            }
        }
    }
`;
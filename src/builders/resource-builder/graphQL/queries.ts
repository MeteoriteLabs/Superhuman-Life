import { gql } from '@apollo/client';

export const GET_ALL_PACKAGES = gql`
    query fitnesspackages($id: ID!) {
        fitnesspackages(filters: { users_permissions_user: { id: { eq: $id } } }) {
            data {
                id
                attributes {
                    packagename
                    Status
                    fitness_package_type {
                        data {
                            attributes {
                                type
                            }
                        }
                    }
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

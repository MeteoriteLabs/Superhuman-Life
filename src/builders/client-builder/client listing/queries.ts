import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
     query getmessage($filter: String!, $id: String) {
          userPackages(
               where: {
                    users_permissions_user: { username_contains: $filter }
                    fitnesspackages: { users_permissions_user: { id: $id } }
               }
          ) {
               id
               users_permissions_user {
                    username
                    email
                    phone
               }
               fitnesspackages {
                    packagename
                    groupendtime
                    Status
                    fitness_package_type {
                         type
                    }
                    users_permissions_user {
                         id
                    }
               }
               fitnessprograms {
                    description
                    updatedAt
               }
          }
     }
`;

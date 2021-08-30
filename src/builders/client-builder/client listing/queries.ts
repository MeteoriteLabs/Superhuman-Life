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
               effective_date
               package_duration
               users_permissions_user {
                    username
                    email
                    phone
                    addresses {
                         city
                    }
               }
               fitnesspackages {
                    packagename
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

export const ADD_CLIENT = gql`
     mutation client(
          $username: String
          $email: String
          $phone: String
          $sex: String
          $type: String
          $suggestedpackage : String
     ) {
          users(
               input: {
                    data: {
                        $username: $username
                        $email: $email
                        $phone: $phone
                        $sex: $sex
                        $type: $type
                        $suggestedpackage : $suggestedpackage
                    }
               }
          ) {
               users {
                    users
                    email
                    phone
                    sex
                    type
               }
          }
     }
`;

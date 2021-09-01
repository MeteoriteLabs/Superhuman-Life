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
                    Phone
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
     mutation client($username: String!, $firstname: String, $lastname: String, $email: String!, $phone: Long) {
          createUser(
               input: {
                    data: {
                         username: $username
                         Firstname: $firstname
                         Lastname: $lastname
                         email: $email
                         Phone: $phone
                    }
               }
          ) {
               user {
                    id
                    createdAt
                    updatedAt
                    username
                    Phone
                    email
               }
          }
     }
`;

import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
     query getmessage($filter: String!, $id: ID!) {
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
                    id
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
                    fitness_package_type {
                         type
                    }
                    ptonline
                    ptoffline
                    grouponline
                    groupoffline
                    recordedclasses
                    fitnesspackagepricing {
                         packagepricing
                    }
               }
               program_managers {
                    id
                    fitnesspackages {
                         id
                         packagename
                         fitness_package_type {
                              type
                         }
                         ptonline
                         ptoffline
                         grouponline
                         groupoffline
                         recordedclasses
                         fitnesspackagepricing {
                              packagepricing
                         }
                    }
                    fitnessprograms {
                         id
                         title
                    }
               }
          }
     }
`;

export const GET_CLIENT_DATA = gql`
     query getclient($id: ID!, $clientid: ID) {
          userPackages(
               where: {
                    fitnesspackages: { users_permissions_user: { id: $id } }
                    users_permissions_user: { id: $clientid }
               }
          ) {
               id
               effective_date
               package_duration

               users_permissions_user {
                    id
                    username
                    email
                    Phone
                    sex
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
                    fitness_package_type {
                         type
                    }
                    ptonline
                    ptoffline
                    grouponline
                    groupoffline
                    recordedclasses
                    fitnesspackagepricing {
                         packagepricing
                    }
               }
               program_managers {
                    id
                    fitnesspackages {
                         id
                         packagename
                         fitness_package_type {
                              type
                         }
                         ptonline
                         ptoffline
                         grouponline
                         groupoffline
                         recordedclasses
                         fitnesspackagepricing {
                              packagepricing
                         }
                    }
                    fitnessprograms {
                         id
                         title
                    }
               }
          }
     }
`;
export const ADD_CLIENT = gql`
     mutation client($username: String!, $firstname: String, $lastname: String, $email: String!, $phone: String) {
          createUser(
               input: {
                    data: {
                         username: $username
                         Firstname: $firstname
                         Lastname: $lastname
                         email: $email
                         Phone: $phone
                         role: "2"
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

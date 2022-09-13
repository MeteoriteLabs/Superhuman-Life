import { gql } from "@apollo/client";

export const GET_CLIENT_NEW = gql`
query getClients($filter: String!, $id: ID!){
     clientPackages(filters: {
       users_permissions_user: {
         username: {
           containsi: $filter
         }
       },
       fitnesspackages: {
        users_permissions_user: {
          id:{
           	eq: $id
          }
         }
       }
     }){
       data{
         id
         attributes{
           effective_date
           package_duration
           users_permissions_user{
             data{
               id
               attributes{
                 username
                 email
                 Phone_Number
                 addresses{
                   data{
                     id
                     attributes{
                       city
                     }
                   }
                 }
               }
             }
           }
           fitnesspackages{
             data{
               id
               attributes{
                 packagename
                 Status
                 fitness_package_type{
                   data{
                     id
                     attributes{
                       type
                     }
                   }
                 }
                 users_permissions_user{
                   data{
                     id
                   }
                 }
                 ptonline
                 ptoffline
                 grouponline
                 groupoffline
                 recordedclasses
                 fitnesspackagepricing
               }
             }
           }
         }
       }
     }
   }
`

// export const GET_CLIENTS = gql`
//      query getmessage($filter: String!, $id: ID!) {
//           userPackages(
//                where: {
//                     users_permissions_user: { username_contains: $filter }
//                     fitnesspackages: { users_permissions_user: { id: $id } }
//                }
//           ) {
//                id
//                effective_date
//                package_duration
//                users_permissions_user {
//                     id
//                     username
//                     email
//                     Phone
//                     addresses {
//                          city
//                     }
//                }
//                fitnesspackages {
//                     packagename
//                     Status
//                     fitness_package_type {
//                          type
//                     }
//                     users_permissions_user {
//                          id
//                     }
//                     fitness_package_type {
//                          type
//                     }
//                     ptonline
//                     ptoffline
//                     grouponline
//                     groupoffline
//                     recordedclasses
//                     fitnesspackagepricing {
//                          packagepricing
//                     }
//                }
//                program_managers {
//                     id
//                     fitnesspackages {
//                          id
//                          packagename
//                          fitness_package_type {
//                               type
//                          }
//                          ptonline
//                          ptoffline
//                          grouponline
//                          groupoffline
//                          recordedclasses
//                          fitnesspackagepricing {
//                               packagepricing
//                          }
//                     }
//                     fitnessprograms {
//                          id
//                          title
//                     }
//                }
//           }
//      }
// `;

export const GET_CHANGEMAKERS = gql`
     query getclient($clientid: ID) {
          userPackages(where: { users_permissions_user: { id: $clientid } }) {
               id

               fitnesspackages {
                    users_permissions_user {
                         id
                         username
                         designation
                    }
               }
          }
     }
`;

export const GET_CHANGEMAKERS_NEW = gql`
query getclient($clientid: ID){
     clientPackages(filters: {
       users_permissions_user: {
         id: {
           eq: $clientid
         }
       }
     }){
       data{
         id
         attributes{
           fitnesspackages{
             data{
               attributes{
                 users_permissions_user{
                   data{
                     id
                     attributes{
                       username
                       designations{
                         data{
                           id
                           attributes{
                             Designation_title
                           }
                         }
                       }
                     }
                   }
                 }
               }
             }
           }
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
                         username
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
                         users_permissions_user {
                              id
                              username
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

export const GET_CLIENT_DATA_NEW = gql`
query getclient($id: ID!, $clientid: ID){
     clientPackages(filters: {
       fitnesspackages: {
         users_permissions_user: {
           id: {
             eq: $id
           }
         }
       },
       users_permissions_user: {
         id: {
           eq: $clientid
         }
       }
     }){
       data{
         id
         attributes{
           effective_date
           package_duration
           users_permissions_user{
             data{
               id
               attributes{
                 username
                 email
                 Phone_Number
                 Gender
                 addresses{
                   data{
                     id
                     attributes{
                       city
                     }
                   }
                 }
               }
             }
           }
           fitnesspackages{
             data{
               id
               attributes{
                 packagename
                 Status
                 fitness_package_type{
                   data{
                     id
                     attributes{
                       type
                     }
                   }
                 }
                 users_permissions_user{
                   data{
                     id
                     attributes{
                       username
                     }
                   }
                 }
                 ptonline
                 ptoffline
                 grouponline
                 groupoffline
                 recordedclasses
                 fitnesspackagepricing
               }
             }
           }
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

export const ADD_CLIENT_NEW = gql`
mutation creatClient($username: String!, $firstname: String, $lastname: String, $email: String!, $phone: String){
     createUsersPermissionsUser(data: {
       username: $username,
       First_Name: $firstname,
       Last_Name: $lastname,
       email: $email,
       Phone_Number: $phone,
       role: "2"
     }){
       data{
         id
       }
     }
   }
`

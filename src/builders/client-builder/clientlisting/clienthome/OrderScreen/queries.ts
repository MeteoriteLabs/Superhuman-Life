import { gql } from "@apollo/client";
export const GET_BOOKINGS = gql`
     query clientBookings($id: ID!, $clientid: ID) {
          clientBookings(
               where: {
                    fitnesspackages: { users_permissions_user: { id: $id } }
                    users_permissions_user: { id: $clientid }
               }
               sort: "booking_date:desc"
          ) {
               id
               users_permissions_user {
                    username
               }
               effective_date
               booking_status
               booking_date
               booking_status
               package_duration
               fitnesspackages {
                    id
                    packagename
                    aboutpackage
                    tags
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
                         description
                    }
               }
          }
     }
`;

export const GET_BOOKINGS_NEW = gql`
query clientBookings($id: ID!, $clientid: ID){
     clientBookings(filters: {
       fitnesspackages: {
         users_permissions_user: {
           id: {
             eq: $id
           }
         }
       },
       users_permissions_users: {
         id: {
           eq: $clientid
         }
       }
     }, sort: ["booking_date:desc"]){
       data{
         id
         attributes{
           users_permissions_users{
             data{
               id
               attributes{
                 username
               }
             }
           }
           effective_date
           booking_date
           booking_status
           package_duration
           fitnesspackages{
             data{
               id
               attributes{
                 packagename
                 aboutpackage
                 tags
                 fitness_package_type{
                   data{
                     id
                     attributes{
                       type
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

export const ADD_SUGGESTION = gql`
     mutation createSuggestion($id: ID, $fitnesspackage: ID) {
          createUserPackageSuggestion(
               input: { data: { users_permissions_user: $id, fitnesspackage: $fitnesspackage } }
          ) {
               userPackageSuggestion {
                    id
               }
          }
     }
`;

export const ADD_SUGGESTION_NEW = gql`
mutation createSuggestion($id: ID, $fitnesspackage: ID){
     createUserPackageSuggestion(data: {
       users_permissions_user: $id,
       fitnesspackage: $fitnesspackage
     }){
       data{
         id
       }
     }
   }
`;

export const GET_FITNESS_PACKAGE_TYPES = gql`
  query fitnessPackageTypes {
    fitnessPackageTypes {
      data {
        id
        attributes {
          type
        }
      }
    }
  }
`;

import { gql } from "@apollo/client";
export const GET_BOOKINGS = gql`
     query clientBookings($id: ID!, $clientid: ID) {
          clientBookings(
               where: {
                    fitnesspackages: { users_permissions_user: { id: $id } }
                    ClientUser: { id: $clientid }
               }
               sort: "booking_date:desc"
          ) {
               id
               ClientUser {
                    data{
                      id
                      attributes{
                        username
                      }
                    }
               }
               effective_date
               Booking_status
               booking_date
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
       ClientUser: {
         id: {
           eq: $clientid
         }
       }
     }, sort: ["booking_date:desc"]){
       data{
         id
         attributes{
          ClientUser{
             data{
               id
               attributes{
                 username
               }
             }
           }
           effective_date
           booking_date
           Booking_status
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

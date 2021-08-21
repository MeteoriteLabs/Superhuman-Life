import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
     query ProgramQuery($id: String!) {
          fitnessprograms(where: {users_permissions_user: {id:$id}}) {
               id
               title
               description
               updatedAt
               fitnessdisciplines {
                    id
                    disciplinename
               }
               duration_days
               level
               users_permissions_user {
                    id
               }
          }
     }
`

export const CREATE_PROGRAM = gql`
     mutation createprogram(
          $title: String
          $fitnessdisciplines: [ID]
          $duration_days: Int!
          $level: ENUM_FITNESSPROGRAMS_LEVEL
          $description: String
          $events: JSON
          $users_permissions_user: ID
     ){
          createFitnessprogram(
               input: {
                    data: {
                         title: $title
                         fitnessdisciplines: $fitnessdisciplines
                         duration_days: $duration_days
                         level: $level
                         description: $description
                         events: $events
                         users_permissions_user: $users_permissions_user
                    }
               }
          ){
               fitnessprogram {
                    id
                    title
               } 
          }
     }
`    
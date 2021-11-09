import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
     query ProgramQuery($id: String!) {
          fitnessprograms(where: {users_permissions_user: {id:$id}, Is_program: false}) {
               id
               title
               description
               updatedAt
               events
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
          $Is_program: Boolean
          $description: String
          $events: JSON
          $renewal_dt: Int
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
                         Is_program: $Is_program
                         renewal_dt: $renewal_dt
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

export const DELETE_PROGRAM = gql`
     mutation deleteprogram($id: ID!){
          deleteFitnessprogram (
               input: {
                    where: { id : $id }
               }
          ){
               fitnessprogram {
                    id
                    title
               }
          }
     }
`
import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
     query getprogramdata($id: String!) {
          fitnessprograms(where: { id: $id }) {
               id
               title
               fitnessdisciplines{
                    id
                    disciplinename
               }
               duration_days
               level
          }
     }
`

export const GET_SCHEDULEREVENTS = gql`
     query getschedulerevents($id: String!) {
          fitnessprograms(where: { id: $id }) {
               id
               events
          }
     }
`

export const GET_WORKOUT = gql`
     query getworkout($id: String!){
          workouts(where: { id: $id }){
               id
               workouttitle
               users_permissions_user{
                    id
               }
          }
     }
`;

export const UPDATE_FITNESSPROGRAMS = gql`
     mutation updatefitnessprograms(
          $fitness_modes: [ID]
          $events: JSON
          $programid: ID!      
     ){
          updateFitnessprogram(
               input: {
                    data: {
                         fitness_modes: $fitness_modes
                         events: $events
                    }
                    where: { id: $programid }
               }
          ){
               fitnessprogram{
                    id
                    title
               }
          }
     }
`
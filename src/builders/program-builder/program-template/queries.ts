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
               rest_days
          }
     }
`

export const FETCH_ACTIVITY = gql`
     query activity($id: String!){
          activities(where: { id: $id}){
               id
               title
          }
     }
`

export const FETCH_WORKOUT = gql`
     query fetchEvent($id: String!) {
          workouts(where: { id: $id }) {
               id
               warmup
               mainmovement
               cooldown
               About
               Benifits
               calories
               workout_URL
               workout_text
               intensity
               equipment_lists{
                    id
                    name
               }
               muscle_groups{
                    id
                    name
               }
          }
     }
`

export const PROGRAM_EVENTS = gql`
     query getprogramdata($id: String!) {
          fitnessprograms(where: { id: $id }) {
               id
               events
          }
     }
`

export const GET_SCHEDULEREVENTS = gql`
     query getschedulerevents($id: String!) {
          fitnessprograms(where: { id: $id }) {
               id
               events
               rest_days
               renewal_dt
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
          $rest_days: JSON
          $programid: ID!
          $renewal_dt: Int      
     ){
          updateFitnessprogram(
               input: {
                    data: {
                         fitness_modes: $fitness_modes
                         events: $events
                         rest_days: $rest_days
                         renewal_dt: $renewal_dt
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

export const CREATE_WORKOUT = gql`
    mutation createworkout(
        $workouttitle: String
        $intensity: ENUM_WORKOUTS_INTENSITY
        $level: ENUM_WORKOUTS_LEVEL
        $About: String
        $Benifits: String
        $users_permissions_user: ID
        $calories: Int
        $fitnessdisciplines: [ID]
        $equipment_lists: [ID]
        $muscle_groups: [ID]
        $workout_URL: String
        $workout_text: String
        $warmup: JSON
        $mainmovement: JSON
        $cooldown: JSON
    ){
        createWorkout(
            input: {
                data: {
                    workouttitle: $workouttitle
                    intensity: $intensity
                    level: $level
                    About: $About
                    Benifits: $Benifits
                    users_permissions_user: $users_permissions_user
                    equipment_lists: $equipment_lists
                    fitnessdisciplines: $fitnessdisciplines
                    muscle_groups: $muscle_groups
                    workout_URL: $workout_URL
                    workout_text: $workout_text
                    calories: $calories
                    warmup: $warmup
                    mainmovement: $mainmovement
                    cooldown: $cooldown
                }
            }
        ){
            workout {
               id
               workouttitle
            }
        }
    }
`
import { gql } from "@apollo/client";

export const FETCH_DATA = gql`
    query fetchdata($id: String){
        workout(where: {id: $id}){
            id
            workouttitle
            intensity
            level
            calories
            About
            Benifits
            workout_URL
            workout_text
            fitnessdisciplines {
                id
                disciplinename
            }
            muscle_groups {
                id
                name
            }
            equipment_lists {
                id
                name
            }
            users_permissions_user {
                id
            }
        }
    }
`

export const FETCH_FITNESSDISCPLINES = gql`
     query fitnessdiscplines{
          fitnessdisciplines(sort: "updatedAt"){
               id
               disciplinename
               updatedAt
          }
     }
`

export const GET_TABLEDATA = gql`
query WorkoutQuery($id: String) {
    workouts(where: {users_permissions_user: {id: $id}}) {
        id
        workouttitle
        intensity
        level
        updatedAt
        calories
        users_permissions_user{
            id
        }
        fitnessdisciplines{
            id
            disciplinename
        }
        muscle_groups {
            name
        }
        equipment_lists {
            id
            updatedAt
            name
            image{
                id
                updatedAt
            }
        }
    }
    fitnessdisciplines(sort: "updatedAt"){
        id
        disciplinename
        updatedAt
   
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

export const UPDATE_WORKOUT = gql`
    mutation updateworkout (
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
        $workoutid: ID!
    ){
        updateWorkout(
            input: {
                data: {
                    workouttitle: $workouttitle
                    intensity: $intensity
                    level: $level
                    About: $About
                    Benefits: $Benefits
                    users_permissions_user: $users_permissions_user
                    calories: $calories
                    fitnessdisciplines: $fitnessdisciplines
                    equipment_lists: $equipment_lists
                    muscle_groups: $muscle_groups
                    workout_URL: $workout_URL
                    workout_text: $workout_text
                    workoutid: $workoutid
                }
                where: { id: $workoutid }
            }
        ){
            workout{
                id
                workouttitle 
            }
        }
    }
`

export const DELETE_WORKOUT = gql`
    mutation deleteworkout($id: ID!){
        deleteWorkout(
            input: {
                where: { id: $id }
            }
        ){
            workout {
                id
                workouttitle
            }
        }
    }
`
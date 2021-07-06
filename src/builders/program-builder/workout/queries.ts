import { gql } from "@apollo/client";

export const GET_FITNESSDISCIPLINES = gql`
     query fitnessdisciplines{
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
        users_permissions_user
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
}
`

export const CREATE_WORKOUT = gql`
    mutation createworkout(
        $workouttitle: String
        $intensity: ENUM_WORKOUTS_INTENSITY
        $level: ENUM_WORKOUTS_LEVEL
        $About: String
        $Benefits: String
        $users_permissions_user: ID
        $equipment_lists: [ID]
        $muscle_groups: [ID]
        $workout_URL: String
        $workout_text: String
    ){
        createWorkout(
            input: {
                data: {
                    workouttitle: $workouttitle
                    intensity: $intensity
                    level: $level
                    About: $About
                    Benefits: $Benefits
                    users_permissions_user: $users_permissions_user
                    equipment_lists: $equipment_lists
                    muscle_groups: $muscle_groups
                    workout_URL: String
                    workout_text: String
                }
            }
        ){
            workout {
                id
                workouttile
            }
        }
    }
`

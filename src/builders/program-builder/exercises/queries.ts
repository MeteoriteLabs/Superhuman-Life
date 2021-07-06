import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
     query ExercisesQuery($id: String) {
          exercises(where: {users_permissions_user: { id: $id}}) {
               id
               updatedAt
               exercisename
               exerciselevel
               exercisetext
               exerciseurl
               exerciseupload {
               name
               }
               users_permissions_user {
               id
               }
               fitnessdiscipline {
               id
               disciplinename
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
               exercisemusclegroups {
               name
               }
          }
          fitnessdisciplines(sort: "updatedAt"){
               id
               disciplinename
               updatedAt
          }
     }
`

export const CREATE_EXERCISE = gql`
        
     mutation createexercise(
          $exercisename: String
          $exerciselevel: ENUM_EXERCISES_EXERCISELEVEL
          $exerciseminidescription: String
          $exercisetext: String
          $exerciseurl: String
          $fitnessdiscipline: ID
          $users_permissions_user: ID
          $equipment_lists: [ID]
          $exercisemusclegroups: [ID]
     ){
          createExercise (
               input: {
               data: {
                    exercisename: $exercisename
                    exerciselevel: $exerciselevel
                    exerciseminidescription: $exerciseminidescription
                    exercisetext: $exercisetext
                    exerciseurl: $exerciseurl
                    users_permissions_user: $users_permissions_user
                    fitnessdiscipline: $fitnessdiscipline
                    equipment_lists: $equipment_lists
                    exercisemusclegroups: $exercisemusclegroups
               }
               }
          ){
               exercise {
               id
               exercisename
               }
          }
     }
`
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

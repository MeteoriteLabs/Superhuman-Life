import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
     query ProgramQuery($id: String!) {
          fitnesssProgramTemplates(where: {users_permissions_user: {id:$id}}) {
               id
               Program_template_name
               updatedAt
               fitnessdisciplines{
                    id
                    disciplinename
               }
               Duration
               level
               Details
               equipment_lists{
                    id
                    name
               }
               users_permissions_user{
                    id
               }
          }
     }
`

export const CREATE_PROGRAM = gql`
     mutation createprogram(
          $Program_template_name: String
          $fitnessdisciplines: [ID]
          $Duration: Int
          $level: ENUM_FITNESSSPROGRAMTEMPLATE_LEVEL
          $Details: String
          $equipment_lists: [ID]
          $users_permissions_user: ID
     ){
          createFitnesssProgramTemplate(
               input: {
                    data: {
                         Program_template_name: $Program_template_name
                         fitnessdisciplines: $fitnessdisciplines
                         Duration: $Duration
                         level: $level
                         Details: $Details
                         equipment_lists: $equipment_lists
                         users_permissions_user: $users_permissions_user
                    }
               }
          ){
               fitnesssProgramTemplate {
                    id
                    Program_template_name
               }
          }
     }
`    
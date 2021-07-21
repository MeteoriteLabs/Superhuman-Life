import { gql } from "@apollo/client";

export const GET_DATA = gql`
     query getprogramdata($id: String!) {
          fitnesssProgramTemplates(where: { id: $id }) {
               id
               Program_template_name
               fitnessdisciplines{
                    id
                    disciplinename
               }
               Duration
               level
               equipment_lists{
                    id
                    name
               }
          }
     }
`
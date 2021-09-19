import { gql } from '@apollo/client'


export const EDIT_PROGRAM = gql`
    mutation fitnessprogram(
            $id: ID! 
            $title:String
            $description:String
            $level:ENUM_FITNESSPROGRAMS_LEVEL
            $fitnessdisciplines: [ID]
            $users_permissions_user: ID
            $Is_program: Boolean
            ){
                updateFitnessprogram(
                    input:{
                        where:{id:$id}
                        data:{
                          title:$title
                          description:$description
                          level:$level
                          fitnessdisciplines: $fitnessdisciplines
                          users_permissions_user: $users_permissions_user
                          Is_program: $Is_program
                        }
                    }
                ){
                    fitnessprogram{
                    title
                    level
                    Is_program
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
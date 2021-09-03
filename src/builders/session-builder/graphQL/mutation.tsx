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

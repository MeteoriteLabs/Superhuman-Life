import { gql } from '@apollo/client'

export const UPDATE_STARTDATE = gql`
     mutation updateStartDate($id: ID!, $startDate: Date!, $endDate: Date!) {
          updateFitnessprogram(
               input: {
                    where: {id: $id}
                    data: {
                         start_dt: $startDate
                         end_dt: $endDate
                    }
               }
          ){
               fitnessprogram {
                    id
                    start_dt
               }
          } 
     }
`

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
          $renewal_dt: Int
          $users_permissions_user: ID
          $Is_program:Boolean
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
                         renewal_dt: $renewal_dt
                         users_permissions_user: $users_permissions_user
                         Is_program: $Is_program
                    }
               }
          ){
               fitnessprogram {
                    id
                    title
                    level
                    duration_days
                    description
                    fitnessdisciplines{
                         id
                    }
                    Is_program
               } 
          }
     }
`    


export const CREATE_PROGRAM_MANAGER = gql`
     mutation createProgramManager(
          $fitnesspackages: [ID]
          $fitnessprograms: [ID]
     ){
          createProgramManager(
               input:{
                    data:{
                         fitnesspackages: $fitnesspackages
                         fitnessprograms: $fitnessprograms
                    }
               }
          ){
               programManager{
                    id
               }
          }
     }
`


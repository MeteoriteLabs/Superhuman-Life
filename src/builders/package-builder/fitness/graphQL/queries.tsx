

import { gql } from '@apollo/client';

export const GET_ADDRESS = gql`
    query fitnessdisciplines{
        addresses{
          id
          address1
          address2
          city
          state
          zipcode
          country
          }
        }
`

export const GET_FITNESS_DISCIPLINES = gql`
    query Fitnessdisciplines {
      fitnessdisciplines{
        id
        disciplinename
      }
    }
`

export const GET_FITNESS_PACKAGE_TYPES = gql`
    query fitnessPackageTypes  {
      fitnessPackageTypes{
        type
        id
      }
}
`


export const GET_FITNESS = gql`
    query fitnesspackages($id:ID!){
        fitnesspackages(sort:"updateAt" where: { users_permissions_user: { id: $id}}
        )
        {
            id
            packagename
            ptoffline
            ptonline
            groupoffline
            grouponline
            recordedclasses
            bookingleadday
            fitness_package_type{
              id
              type
            }
            users_permissions_user{
                id
            }
            disciplines{
              disciplinename
            }
          fitnesspackagepricing{
            packagepricing
          }
          duration
          Status
          is_private
        }
        }
`


export const GET_SINGLE_PACKAGE_BY_ID = gql`
      query fitnesspackage($id:ID!){
        fitnesspackage(id:$id)
        {
            id
            packagename
            tags
            level
            aboutpackage
            benefits
            introvideourl
            mode
            ptonline
            ptoffline
            grouponline
            groupoffline
            recordedclasses
            restdays
            bookingleadday
            fitnesspackagepricing{
              id
              packagepricing
            }
            duration
            groupstarttime
            groupendtime
            groupinstantbooking
            address{
              id
            }         
            ptclasssize
            classsize
            groupdays
            fitness_package_type{
              id
            }
            users_permissions_user{
              id
            }
            Status
            is_private
            disciplines{
              id
              disciplinename
            }
        }
}
`
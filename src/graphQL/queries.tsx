

import {gql} from '@apollo/client';

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
        disciplinename
      }
    }
`
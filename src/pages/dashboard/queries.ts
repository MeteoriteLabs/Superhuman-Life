import {gql} from '@apollo/client';

export const GET_USER_ORGANIZATIONS = gql`
    query getUserOrganization($id: ID!) {
        usersPermissionsUsers(filters: {
            id: {
              eq: $id
            }
          }){
            data{
              id
              attributes{
                organizations{
                  data{
                    id
                    attributes{
                      Organization_Name
                    }
                  }
                }
              }
            }
          }
    }
`
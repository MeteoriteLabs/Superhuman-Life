import { gql } from "@apollo/client";

export const GET_USER_GOAL = gql`
query getUserGoal($id: ID!){
     userGoals(filters: {
          id: {
            eq: $id
          }
        }){
          data{
            id
            attributes{
              end
              start
              goals{
                data{
                  attributes{
                    name
                  }
                }
              }
            }
          }
        }
   }
`
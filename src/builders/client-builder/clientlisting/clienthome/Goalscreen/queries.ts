import { gql } from "@apollo/client";

export const ADD_GOAL = gql`
     mutation addgoal($goals: [ID], $assignedBy: [ID], $start: Date!, $end: Date, $user_permissions_user: ID) {
          createUserGoal(
               input: {
                    data: {
                         goals: $goals
                         assignedBy: $assignedBy
                         start: $start
                         end: $end
                         users_permissions_user: $user_permissions_user
                    }
               }
          ) {
               userGoal {
                    id
               }
          }
     }
`;

export const GET_GOALS = gql`
     query getGoals($id: ID) {
          userGoals(where: { users_permissions_user: $id }) {
               id
               start
               end
               goals {
                    id
                    name
               }
               assignedBy {
                    id
                    username
               }
               updatedAt
          }
     }
`;

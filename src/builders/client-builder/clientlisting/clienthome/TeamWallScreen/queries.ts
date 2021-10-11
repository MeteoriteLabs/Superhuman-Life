import { gql } from "@apollo/client";

export const GET_MOODSCALE = gql`
     query scale {
          ratingScales(where: { Type: "Mood" }) {
               id
               Type
               item_type
               items
          }
     }
`;

export const GET_FITNESSSCALE = gql`
     query scale {
          ratingScales(where: { Type: "fitness" }) {
               id
               Type
               item_type
               items
          }
     }
`;

export const ADD_RATING = gql`
     mutation addRating(
          $type: String
          $resource_id: String
          $rating: Int
          $max_rating: Int
          $rating_scale_id: ID
          $user_permissions_user: ID
     ) {
          createRating(
               input: {
                    data: {
                         type: $type
                         resource_id: $resource_id
                         users_permissions_user: $user_permissions_user
                         rating: $rating
                         max_rating: $max_rating
                         rating_scale: $rating_scale_id
                    }
               }
          ) {
               rating {
                    id
               }
          }
     }
`;

export const ADD_NOTE = gql`
     mutation addNote($type: String, $resource_id: String, $user_permissions_user: ID, $note: String) {
          createFeedbackNote(
               input: {
                    data: {
                         type: $type
                         resource_id: $resource_id
                         users_permissions_user: $user_permissions_user
                         note: $note
                    }
               }
          ) {
               feedbackNote {
                    id
               }
          }
     }
`;

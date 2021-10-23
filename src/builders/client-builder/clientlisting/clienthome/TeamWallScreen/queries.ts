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
          $resource_type: String
          $user_permissions_user: ID
          $clientid: ID
     ) {
          createRating(
               input: {
                    data: {
                         type: $type
                         resource_id: $resource_id
                         users_permissions_user: $user_permissions_user
                         rating: $rating
                         max_rating: $max_rating
                         resource_type: $resource_type
                         rating_scale: $rating_scale_id
                         target_user: $clientid
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
     mutation addNote($type: String, $resource_id: String, $user_permissions_user: ID, $note: String, $clientid: ID) {
          createFeedbackNote(
               input: {
                    data: {
                         type: $type
                         resource_id: $resource_id
                         users_permissions_user: $user_permissions_user
                         note: $note
                         target_user: $clientid
                    }
               }
          ) {
               feedbackNote {
                    id
               }
          }
     }
`;

export const GET_NOTES = gql`
     query getfeedbackNotes($arr: [ID]) {
          feedbackNotes(where: { users_permissions_user: { id_in: $arr } }, sort: "updatedAt:desc") {
               id
               updatedAt
               type
               users_permissions_user {
                    id
                    username
                    designation
               }
               note
               resource_id
               feedback_comments {
                    id
                    comment
                    users_permissions_user {
                         id
                         username
                    }
               }
          }
     }
`;

export const CHECK_NOTES = gql`
     query checkNotes($id: ID, $clientid: ID) {
          feedbackNotes(where: { users_permissions_user: { id: $id }, target_user: { id: $clientid } }) {
               id
               resource_id
          }
     }
`;

export const ADD_COMMENT = gql`
     mutation addComment($feedback_note: ID, $comment: String, $users_permissions_user: ID) {
          createFeedbackComment(
               input: {
                    data: {
                         feedback_note: $feedback_note
                         comment: $comment
                         users_permissions_user: $users_permissions_user
                    }
               }
          ) {
               feedbackComment {
                    id
               }
          }
     }
`;

export const DELETE_NOTE = gql`
     mutation deleteNote($id: ID!) {
          deleteFeedbackNote(input: { where: { id: $id } }) {
               feedbackNote {
                    id
               }
          }
     }
`;
export const DELETE_COMMENT = gql`
     mutation deleteComment($id: ID!) {
          deleteFeedbackComment(input: { where: { id: $id } }) {
               feedbackComment {
                    id
               }
          }
     }
`;

export const GET_TAGNAME = gql`
     query TagName($id: ID) {
          workouts(where: { id: $id }) {
               id
               workouttitle
          }
     }
`;

export const GET_RATING_NOTES = gql`
     query ratingsforNotes($id: ID, $clientid: ID, $type: String) {
          ratings(where: { resource_id_contains: $id, type: $type, target_user: { id: $clientid } }) {
               id
               rating
               max_rating
               target_user {
                    id
                    username
               }
               type
          }
     }
`;

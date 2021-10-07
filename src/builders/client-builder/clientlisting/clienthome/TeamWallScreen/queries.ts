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

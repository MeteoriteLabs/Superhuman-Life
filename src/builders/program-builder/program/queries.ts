import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
  query ProgramQuery($id: ID!) {
    fitnessprograms(
      filters: {
        users_permissions_user: { id: { eq: $id } }
      }
    ) {
      data {
        id
        attributes {
          title
          description
          updatedAt
          duration_days
          level
          users_permissions_user {
            data {
              id
            }
          }
          fitnessdisciplines {
            data {
              id
              attributes {
                disciplinename
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_DATA = gql`
  query ProgramQuery($id: ID!) {
    fitnessprograms(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          title
          description
          updatedAt
          events
          duration_days
          level
          users_permissions_user {
            data {
              id
            }
          }
          fitnessdisciplines {
            data {
              id
              attributes {
                disciplinename
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_PROGRAM = gql`
  mutation createprogram(
    $title: String
    $fitnessdisciplines: [ID]
    $duration_days: Int!
    $level: ENUM_FITNESSPROGRAM_LEVEL
    $description: String
    $users_permissions_user: ID!
    $startdate: Date
    $enddate: Date
  ) {
    createFitnessprogram(
      data: {
        title: $title
        fitnessdisciplines: $fitnessdisciplines
        duration_days: $duration_days
        level: $level
        description: $description
        users_permissions_user: $users_permissions_user
        start_date: $startdate
        end_date: $enddate
      }
    ) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_PROGRAM = gql`
  mutation updateprogram(
    $title: String
    $fitnessdisciplines: [ID]
    $duration_days: Int
    $level: ENUM_FITNESSPROGRAM_LEVEL
    $description: String
    $programid: ID!
    $startdate: Date
    $enddate: Date
  ) {
    updateFitnessprogram(
      id: $programid
      data: {
        title: $title
        fitnessdisciplines: $fitnessdisciplines
        duration_days: $duration_days
        level: $level
        description: $description
        start_date: $startdate
        end_date: $enddate
      }
    ) {
      data {
        id
        attributes {
          title
        }
      }
    }
  }
`;

export const DELETE_PROGRAM = gql`
  mutation deleteprogram($id: ID!) {
    deleteFitnessprogram(id: $id) {
      data {
        id
        attributes {
          title
        }
      }
    }
  }
`;
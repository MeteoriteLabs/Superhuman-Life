import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
  query ProgramQuery($id: ID!) {
    fitnessprograms(
      filters: {
        users_permissions_user: { id: { eq: $id } }
        Is_program: { eq: false }
      }
    ) {
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
    $events: JSON
    $renewal_dt: Int
    $users_permissions_user: ID!
  ) {
    createFitnessprogram(
      data: {
        title: $title
        fitnessdisciplines: $fitnessdisciplines
        duration_days: $duration_days
        level: $level
        description: $description
        Is_program: false
        renewal_dt: $renewal_dt
        events: $events
        users_permissions_user: $users_permissions_user
      }
    ) {
      data {
        id
        attributes {
          title
          Is_program
        }
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
  ) {
    updateFitnessprogram(
      id: $programid
      data: {
        title: $title
        fitnessdisciplines: $fitnessdisciplines
        duration_days: $duration_days
        level: $level
        description: $description
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
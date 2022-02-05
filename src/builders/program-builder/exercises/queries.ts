import { gql } from "@apollo/client";

export const FETCH_DATA = gql`
  query fetchdata($id: ID!) {
    exercises(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          updatedAt
          exercisename
          exerciselevel
          exerciseminidescription
          exercisetext
          exerciseurl
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
          equipment_lists {
            data {
              id
              attributes {
                updatedAt
                name
              }
            }
          }
          muscle_groups {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

export const FETCH_WORKOUTS = gql`
  query fetchworkouts($id: ID!) {
    workouts(filters: { users_permissions_user: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          workouttitle
          warmup
          mainmovement
          cooldown
          About
          Benifits
          calories
          workout_URL
          workout_text
          intensity
          equipment_lists {
            data {
              id
              attributes {
                name
              }
            }
          }
          muscle_groups {
            data {
              id
              attributes {
                name
              }
            }
          }
          users_permissions_user {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_EXERCISELIST = gql`
  query exercisesList($id: ID!, $filter: String!) {
    exercises(
      filters: {
        users_permissions_user: { id: { eq: $id } }
        exercisename: { containsi: $filter }
      }
    ) {
      data {
        id
        attributes {
          exercisename
          users_permissions_user {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const FETCH_FITNESSDISCPLINES = gql`
  query fitnessdiscplines {
    fitnessdisciplines(sort: ["updatedAt"]) {
      data {
        id
        attributes {
          disciplinename
          updatedAt
        }
      }
    }
  }
`;

export const GET_TABLEDATA = gql`
  query ExercisesQuery($id: ID) {
    exercises(filters: { users_permissions_user: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          updatedAt
          exercisename
          exerciselevel
          exercisetext
          exerciseurl
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
          equipment_lists {
            data {
              id
              attributes {
                updatedAt
                name
              }
            }
          }
          muscle_groups {
            data {
              id
              attributes {
                name
              }
            }
          }
        }
      }
    }
  }
`;

// export const GET_TABLEDATA = gql`
//      query ExercisesQuery($id: String) {
//           exercises(where: {users_permissions_user: { id: $id}}) {
//                id
//                updatedAt
//                exercisename
//                exerciselevel
//                exercisetext
//                exerciseurl
//                exerciseupload {
//                name
//                }
//                users_permissions_user {
//                id
//                }
//                fitnessdisciplines {
//                id
//                disciplinename
//                }
//                equipment_lists {
//                id
//                updatedAt
//                name
//                image{
//                id
//                updatedAt
//                }
//                }
//                exercisemusclegroups {
//                name
//                }
//           }
//      }
// `

export const CREATE_EXERCISE = gql`
  mutation createexercise(
    $exercisename: String
    $exerciselevel: ENUM_EXERCISE_EXERCISELEVEL
    $exerciseminidescription: String
    $exercisetext: String
    $exerciseurl: String
    $fitnessdisciplines: [ID]
    $users_permissions_user: ID!
    $equipment_lists: [ID]
    $exercisemusclegroups: [ID]
  ) {
    createExercise(
      data: {
        exercisename: $exercisename
        exerciselevel: $exerciselevel
        exerciseminidescription: $exerciseminidescription
        exercisetext: $exercisetext
        exerciseurl: $exerciseurl
        users_permissions_user: $users_permissions_user
        fitnessdisciplines: $fitnessdisciplines
        equipment_lists: $equipment_lists
        muscle_groups: $exercisemusclegroups
      }
    ) {
      data {
        id
        attributes {
          exercisename
        }
      }
    }
  }
`;
export const UPDATE_EXERCISE = gql`
  mutation updateexercise(
    $exercisename: String
    $exerciselevel: ENUM_EXERCISE_EXERCISELEVEL
    $exerciseminidescription: String
    $exercisetext: String
    $exerciseurl: String
    $fitnessdisciplines: [ID]
    $users_permissions_user: ID!
    $equipment_lists: [ID]
    $exercisemusclegroups: [ID]
    $exerciseid: ID!
  ) {
    updateExercise(
      id: $exerciseid
      data: {
        exercisename: $exercisename
        exerciselevel: $exerciselevel
        exerciseminidescription: $exerciseminidescription
        exercisetext: $exercisetext
        exerciseurl: $exerciseurl
        users_permissions_user: $users_permissions_user
        fitnessdisciplines: $fitnessdisciplines
        equipment_lists: $equipment_lists
        muscle_groups: $exercisemusclegroups
      }
    ) {
      data {
        id
        attributes {
          exercisename
        }
      }
    }
  }
`;
export const DELETE_EXERCISE = gql`
  mutation deleteexercise($id: ID!) {
    deleteExercise(id: $id) {
      data {
        id
        attributes {
          exercisename
        }
      }
    }
  }
`;
import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
  query getprogramdata($id: ID!) {
    fitnessprograms(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          title
          duration_days
          rest_days
          description
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

export const FETCH_ACTIVITY = gql`
  query activity($id: ID!) {
    activities(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          title
        }
      }
    }
  }
`;

export const FETCH_WORKOUT = gql`
  query fetchEvent($id: ID!) {
    workouts(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          workouttitle
          intensity
          level
          warmup
          mainmovement
          cooldown
          About
          workout_URL
          workout_text
          calories
          muscle_groups {
            data {
              attributes {
                name
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
        }
      }
    }
  }
`;

export const PROGRAM_EVENTS = gql`
  query getprogramdata($id: ID!) {
    fitnessprograms(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          events
        }
      }
    }
  }
`;

export const GET_SCHEDULEREVENTS = gql`
  query getschedulerevents($id: ID) {
    fitnessprograms(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          events
          rest_days
          renewal_dt
        }
      }
    }
  }
`;

export const GET_WORKOUT = gql`
  query getworkout($id: ID!) {
    workouts(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          workouttitle
        }
      }
    }
  }
`;

export const UPDATE_FITNESSPROGRAMS = gql`
  mutation updatefitnessprograms(
    $fitness_modes: [ID]
    $events: JSON
    $rest_days: JSON
    $programid: ID!
    $renewal_dt: Int
  ) {
    updateFitnessprogram(
      id: $programid
      data: {
        fitness_modes: $fitness_modes
        events: $events
        rest_days: $rest_days
        renewal_dt: $renewal_dt
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

export const CREATE_WORKOUT = gql`
  mutation createworkout(
    $workouttitle: String
    $intensity: String
    $level: String
    $About: String
    $Benifits: String
    $users_permissions_user: ID
    $calories: Int
    $fitnessdisciplines: [ID]
    $equipment_lists: [ID]
    $muscle_groups: [ID]
    $workout_URL: String
    $workout_text: String
    $warmup: JSON
    $mainmovement: JSON
    $cooldown: JSON
  ) {
    createWorkout(
      data: {
        workouttitle: $workouttitle
        intensity: $intensity
        level: $level
        About: $About
        Benifits: $Benifits
        users_permissions_user: $users_permissions_user
        equipment_lists: $equipment_lists
        fitnessdisciplines: $fitnessdisciplines
        muscle_groups: $muscle_groups
        workout_URL: $workout_URL
        workout_text: $workout_text
        calories: $calories
        warmup: $warmup
        mainmovement: $mainmovement
        cooldown: $cooldown
      }
    ) {
      data {
        id
        attributes {
          workouttitle
        }
      }
    }
  }
`;

export const GET_SLOTS_TO_CHECK = gql`
query getAllChangeMakerAvailabilityHolidays($id: ID!, $dateUpperLimit: Date, $dateLowerLimit: Date) {
  changemakerAvailabilties(filters: {
    date: { between: [$dateUpperLimit, $dateLowerLimit] }
    users_permissions_user: {
      id: {
        eq: $id
      }
    }
  }, pagination: {pageSize: 200}){
    data{
      id
      attributes{
        holiday_title
        booking_slots
        Is_Holiday
        date
        users_permissions_user{
          data{
            id
          }
        }
      }
    }
  }
}
`

export const UPDATE_CHANGEMAKER_AVAILABILITY_WORKHOURS = gql`
  mutation updateCHageMakerAvailabilityWorkHour($id: ID!, $slots: JSON){
    updateChangemakerAvailabilty(id: $id, data: {
      booking_slots: $slots
    }){
      data{
        id
        attributes{
          date
        }
      }
    }
  }
`
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
    $intensity: ENUM_WORKOUT_INTENSITY 
    $level: ENUM_WORKOUT_LEVEL 
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

export const GET_SESSIONS = gql`
  query getSessions($id: ID!, $startDate: Date, $endDate: Date) {
    tags(filters: {
      id: {
        eq: $id
      },
      sessions: {
        session_date: {
          gte: $startDate,
          lte: $endDate
        }
      }
    }){
      data{
        id
        attributes{
          tag_name
          fitnesspackage{
            data{
              id
              attributes{
                packagename
                level
              }
            }
          }
          sessions{
            data{
              id
              attributes{
                day_of_program
                session_date
                tag
                type
                end_time
                Is_restday
                start_time
                mode
                session_date
                activity{
                  data{
                    id
                    attributes{
                      title
                    }
                  }
                }
                activity_target
                workout{
                  data{
                    id
                    attributes{
                      workouttitle
                    }
                  }
                }
              }
            }
          }
          client_packages{
            data{
              id
              attributes{
                effective_date
                accepted_date
                users_permissions_user{
                  data{
                    id
                    attributes{
                      username
                      First_Name
                      Last_Name
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const CREATE_SESSION = gql`
  mutation createSessionMutation(
    $start_time: String,
    $end_time: String,
    $workout: ID,
    $activity: ID,
    $activity_target: JSON,
    $tag: String,
    $mode: String,
    $type: String,
    $Is_restday: Boolean,
    $session_date: Date,
  ){
    createSession(data: {
      type: $type,
      end_time: $end_time,
      start_time: $start_time,
      activity_target: $activity_target,
      tag: $tag,
      mode: $mode,
      workout: $workout,
      activity: $activity,
      Is_restday: $Is_restday,
      session_date: $session_date
    }){
      data{
        id
      }
    }
  }
`;

export const UPDATE_TAG_SESSIONS = gql`
  mutation updateTagSessions($id: ID!, $sessions_ids: [ID]){
    updateTag(id:$id, data: {
      sessions: $sessions_ids
    }){
      data{
        id
      }
    }
  }
`

export const UPDATE_SESSION = gql`
  mutation updateSessionMutation(
    $id: ID!,
    $day_of_program: Int,
    $start_time: String,
    $end_time: String,
    $workout: ID,
    $activity: ID,
    $activity_target: JSON,
    $tag: String,
    $mode: String,
    $type: String
  ){
    updateSession(id: $id, data: {
      day_of_program: $day_of_program,
      start_time: $start_time,
      end_time: $end_time,
      workout: $workout,
      activity: $activity,
      activity_target: $activity_target,
      tag: $tag,
      mode: $mode,
      type: $type,
    }){
      data{
        id
      }
    }
  }
`;

export const DELETE_SESSION = gql`
  mutation deleteSessionMutation(
    $id: ID!
  ){
    deleteSession(id: $id){
      data{
        id
      }
    }
  }
`

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
`;
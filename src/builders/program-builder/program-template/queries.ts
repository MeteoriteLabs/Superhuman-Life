import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
  query getprogramdata($id: ID!) {
    fitnessprograms(filters: { id: { eq: $id } }, pagination:{pageSize: 100}) {
      data {
        id
        attributes {
          title
          duration_days
          sessions(pagination:{pageSize: 100}){
            data{
              id
              attributes{
                day_of_program
                start_time
                end_time
                tag
                Is_restday
                type
                mode
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
                changemaker{
                  data{
                    id
                  }
                }
              }
            }
          }
          description
          start_date
          end_date
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
          Workout_Video_ID
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
          sessions{
            data{
              id
              attributes{
                day_of_program
                Is_restday
                tag
                type
                mode
                end_time
                start_time
                Is_restday
                workout{
                  data{
                    id
                  }
                }
                activity{
                  data{
                    id
                  }
                }
                activity_target
              }
            }
          }
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
          sessions(
            pagination: { pageSize: 100 }
          ) {
            data {
              id
              attributes {
                day_of_program
                start_time
                end_time
                tag
                Is_restday
                type
                mode
                session_date
              }
            }
          }
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

export const GET_CLIENT_SESSIONS = gql`
query getClientSessions($id: ID!, $startDate: Date, $endDate: Date, $Is_restday: Boolean){
  sessionsBookings(filters: {
    client: {
      id: {
        eq: $id
      }
    },
    session:{
      session_date: {
        gte: $startDate,
        lte: $endDate
      }
      Is_restday: {
        eq: $Is_restday
      }
    }
  }){
    data{
      id
      attributes{
        client{
          data{
            id
            attributes{
              username
            }
          }
        }
        session{
          data{
            id
            attributes{
              type
              session_date
              tag
              end_time
              Is_restday
              start_time
              mode
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
        
      }
    }
  }
}
`

export const GET_SESSIONS = gql`
  query getSessions($id: ID!, $startDate: Date, $endDate: Date, $Is_restday: Boolean) {
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
    }, pagination: {pageSize: 100}){
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
          sessions(filters: {
            Is_restday: {
              eq: $Is_restday
            }
          }, pagination: {pageSize: 100}){
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
    $changemaker: ID,
    $day_of_program: Int
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
      session_date: $session_date,
      changemaker: $changemaker,
      day_of_program: $day_of_program
    }){
      data{
        id
      }
    }
  }
`;

export const UPDATE_FITNESSPORGRAMS_SESSIONS = gql`
  mutation updatefitnessprogramsSessions($id: ID!, $sessions_ids: [ID]){
    updateFitnessprogram(id: $id, data: {
      sessions: $sessions_ids
    }){
      data{
        id
      }
    }
  }
`

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
    $type: String,
    $session_date: Date
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
      session_date: $session_date
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

export const CREATE_SESSION_BOOKING = gql`
     mutation createSessionBooking(
          $session: ID
          $client: ID
          $session_date: Date
     ){
          createSessionsBooking(data:{
               session_date: $session_date,
               session: $session,
               client: $client,
               Session_booking_status: Booked
             }){
               data{
                 id
                 attributes{
                   session_date
                 }
               }
             }
     }
`;

export const GET_SESSION_BOOKINGS = gql`
     query getSessionBooking($id: ID!){
      sessionsBookings(filters: {
        session: {
          id: {
            eq: $id
          }
        }
      }){
        data{
          id
          attributes{
            createdAt
            Session_booking_status
            client{
              data{
                id
                attributes{
                  username
                }
              }
            }
          }
        }
      }
     }
`

export const UPDATE_SESSION_BOOKING = gql`
     mutation updateSessionBooking($id: ID!, $status: ENUM_SESSIONSBOOKING_SESSION_BOOKING_STATUS){
      updateSessionsBooking(id: $id, data: {
        Session_booking_status: $status
      }){
        data{
          id
        }
      }
     }
`;

export const GET_TEMPLATE_SESSIONS = gql`
query getTemplateSessions($id: ID!){
  fitnessprograms(filters: {
    id: {
      eq: $id
    }
  }){	
  	data{
      id
      attributes{
        sessions(pagination: {pageSize: 100}){
          data{
            id
            attributes{
              day_of_program
              Is_restday
            }
          }
        }
      }
    }
  }
}
`;

export const REPLACE_SESSION_WORKOUT = gql`
mutation replaceSessionWorkout($id: ID!, $workoutId: ID!){
  updateSession(id: $id, data: {
    workout: $workoutId
  }){
    data{
      id
    }
  }
}
`


// export const GET_SESSIONS_ON_DATE = gql`
//      query getSessionsOnDate($id: ID!, $date: Date) {

//      }
// `
import { gql } from "@apollo/client";

export const GET_TABLEDATA = gql`
  query ProgramQuery($id: ID) {
    fitnessprograms(pagination: {
      pageSize: 100
    }, filters:{
      users_permissions_user:{
        id: { eq: $id }
      }
    }){
      data{
        id
        attributes{
          title
          description
          updatedAt
          duration_days
          level
          start_date
          end_date
          sessions(pagination: { pageSize: 100}){
            data{
              id
                attributes{
                session_date
                tag
                mode
                type
                day_of_program
                start_time
                end_time
                Is_restday
                Is_program_template
                activity{
                  data{
                    id
                  }
                }
                activity_target
                workout{
                  data{
                    id
                  }
                }
              }
            }
          }
          users_permissions_user{
            data{
              id
            }
          }
          fitnessdisciplines{
            data{
              id
              attributes{
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
  query ProgramQuery($id: ID) {
    fitnessprograms(filters: { id: { eq: $id } }) {
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

export const CREATE_SESSION = gql`
  mutation CreateSessions(
    $session_date: Date
    $tag: String
    $mode: String
    $type: String
    $day_of_program: Int
    $start_time: String
    $end_time: String
    $Is_restday: Boolean
    $Is_program_template: Boolean
    $activity_target: JSON
    $activity: ID
    $workout: ID
    $changemaker: ID!
  ){
    createSession(data: {
      session_date: $session_date,
      tag: $tag,
      mode: $mode,
      type: $type,
      day_of_program: $day_of_program,
      start_time: $start_time,
      end_time: $end_time,
      Is_restday: $Is_restday,
      Is_program_template: $Is_program_template,
      activity: $activity,
      workout: $workout,
      activity_target: $activity_target,
      changemaker: $changemaker
    }){
      data{
        id
      }
    }
  }
`

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
    $sessions: [ID]
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
        sessions: $sessions
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
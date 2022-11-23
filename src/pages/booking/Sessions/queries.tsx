import { gql } from "@apollo/client";

export const GET_SESSIONS = gql`
  query getSessions($id: ID, $session_date: Date) {
    sessions(
      filters: {
        changemaker: { id: { eq: $id } }
        Is_restday: { eq: false }
        session_date: { eq: $session_date }
      }
    ) {
      data {
        id
        attributes {
          type
          start_time
          end_time
          activity {
            data {
              id
              attributes {
                title
              }
            }
          }
          workout {
            data {
              id
              attributes {
                workouttitle
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SESSION_BOOKINGS = gql`
  query getSessionBookings($id: ID) {
    sessionsBookings(filters: { session: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          session_date
          session_time
          Session_booking_status
          client {
            data {
              id
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SESSION_BOOKINGS_FOR_CLIENTS = gql`
  query getSessionBookings($id: ID) {
    sessionsBookings(filters: { client: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          createdAt
          session {
            data {
              id
              attributes {
                type
                activity{
                  data{
                    id
                    attributes{
                      title
                    }
                  }
                }
                workout{
                  data{
                    id
                    attributes{
                      workouttitle
                    }
                  }
                }
                start_time
                end_time
                session_date
              }
            }
          }
          Session_booking_status
          client {
            data {
              id
              attributes {
                username
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_CLIENTS = gql`
  query clientPackages($id: ID) {
    clientPackages(
      filters: {
        fitnesspackages: { users_permissions_user: { id: { eq: $id } } }
      }
    ) {
      data {
        id
        attributes {
          users_permissions_user {
            data {
              id
              attributes {
                username
                First_Name
                Last_Name
              }
            }
          }
          fitnesspackages {
            data {
              id
              attributes {
                packagename
                users_permissions_user {
                  data {
                    id
                    attributes {
                      username
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

export const UPDATE_STATUS = gql`
  mutation updateStatus(
    $id: ID!
    $data: SessionsBookingInput!
  ) {
    updateSessionsBooking(
      id: $id
      data: $data
    ) {
      data {
        id
      }
    }
  }
`;

import { gql } from "@apollo/client";

export const GET_ALL_TAGS = gql`
  query tags($id: ID!) {
    tags(
      filters: {
        fitnesspackage: { users_permissions_user: { id: { eq: $id } } }
      }
    ) {
      data {
        id
        attributes {
          tag_name
          client_packages {
            data {
              id
              attributes {
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
          sessions {
            data {
              id
              attributes {
                sessions_bookings {
                  data {
                    id
                    attributes {
                      session_date
                      session_time
                      Session_booking_status
                    }
                  }
                }
              }
            }
          }
          fitnesspackage {
            data {
              id
              attributes {
                packagename
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
    clientPackages(filters: { users_permissions_user: { id: { eq: $id } } }) {
      data {
        id
        attributes{
          fitnesspackages{
            data{
              id
              attributes{
                packagename
                users_permissions_user{
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
      }
    }
  }
`;

export const GET_TAGS = gql`
  query tags($id: ID) {
    tags(filters:{client_packages:{id:{eq: id}}}) {
      data{
        id
        attributes{
          tag_name
          sessions{
            data{
              id
              attributes{
                type
                
              }
            }
          }
        }
      }
    }
  }
`;


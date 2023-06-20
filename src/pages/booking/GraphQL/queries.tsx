import { gql } from '@apollo/client';

export const GET_ALL_BOOKINGS = gql`
  query clientBookings($id: ID!, $start: Int, $limit: Int) {
    clientBookings(
      filters: { fitnesspackages: { users_permissions_user: { id: { eq: $id } } } }
      pagination: { start: $start, limit: $limit }
      sort: ["booking_date:desc"]
    ) {
      meta {
        pagination {
          pageCount
          total
        }
      }
      data {
        id
        attributes {
          ClientUser {
            data {
              id
              attributes {
                username
                email
                Phone_Number
                First_Name
                Last_Name
              }
            }
          }
          effective_date
          Booking_status
          booking_date
          package_duration
          fitnesspackages {
            data {
              id
              attributes {
                packagename
                fitness_package_type {
                  data {
                    attributes {
                      type
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
      }
    }
  }
`;

export const GET_TAGS = gql`
  query tags($id: ID!) {
    tags(
      filters: { fitnesspackage: { users_permissions_user: { id: { eq: $id } } } }
      pagination: { pageSize: 100 }
    ) {
      data {
        id
        attributes {
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

export const FILTER_PACKAGES = gql`
  query userPackages($id: ID!, $sorts: String) {
    userPackages(
      where: { fitnesspackages: { users_permissions_user: { id: $id } } }
      sort: $sorts
    ) {
      id
      users_permissions_user {
        username
      }
      effective_date
      purchase_date
      package_duration
      fitnesspackages {
        id
        packagename
        fitness_package_type {
          type
        }
        users_permissions_user {
          id
        }
      }
    }
  }
`;

export const BOOKING_CONFIG = gql`
  query bookingConfigs($id: ID!) {
    bookingConfigs(
      pagination: { pageSize: 100 }
      filters: { fitnesspackage: { users_permissions_user: { id: { eq: $id } } } }
    ) {
      data {
        id
        attributes {
          fitnesspackage {
            data {
              attributes {
                packagename
                fitness_package_type {
                  data {
                    attributes {
                      type
                    }
                  }
                }
              }
            }
          }
          isAuto
          bookingsPerDay
          BookingsPerMonth
        }
      }
    }
  }
`;

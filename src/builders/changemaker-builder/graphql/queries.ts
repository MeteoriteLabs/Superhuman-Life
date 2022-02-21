import { gql } from "@apollo/client";

export const GET_ALL_CLIENT_PACKAGE_BY_TYPE = gql`
  query userPackages($id: ID!, $type: [String], $date: Date) {
    clientPackages(
      filters: {
        fitnesspackages: {
          users_permissions_user: { id: { eq: $id } }
          fitness_package_type: { type: { or: $type } }
        }
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
              }
            }
          }
          effective_date
          accepted_date
          fitnesspackages {
            data {
              id
              attributes {
                expiry_date
                fitness_package_type {
                  data {
                    id
                    attributes {
                      type
                    }
                  }
                }
                packagename
                groupstarttime
                groupendtime
                restdays
                ptonline
                ptoffline
                grouponline
                groupoffline
                recordedclasses
                duration
                Status
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
                fitnesspackages {
                  data {
                    id
                    attributes {
                      expiry_date
                      fitness_package_type {
                        data {
                          id
                          attributes {
                            type
                          }
                        }
                      }
                      packagename
                      groupstarttime
                      groupendtime
                      restdays
                      ptonline
                      ptoffline
                      grouponline
                      groupoffline
                      recordedclasses
                      duration
                      Status
                    }
                  }
                }
                fitnessprograms {
                  data {
                    id
                    attributes {
                      title
                      duration_days
                      rest_days
                      start_dt
                      level
                      events
                      description
                      renewal_dt
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
            }
          }
        }
      }
    }
    changemakerAvailabilties(filters: {
      date: { eq: $date }
      users_permissions_user: {
        id: {
          eq: $id
        }
      }
    }){
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
`;

export const GET_ALL_CHANGEMAKER_HOLIDAYS = gql`
  query getAllChangeMakerHolidays(
    $id: ID!
    $dateUpperLimit: Date
    $dateLowerLimit: Date
  ) {
    changemakerHolidays(
      filters: {
        users_permissions_user: { id: { eq: $id } }
        date: { between: [$dateUpperLimit, $dateLowerLimit] }
      }
    ) {
      data {
        id
        attributes {
          description
          date
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

export const GET_USER_WEEKLY_CONFIG = gql`
  query getUserWeeklyConfig($id: ID!, $date: Date, $type: [String]) {
    usersPermissionsUsers(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          Changemaker_weekly_schedule
          booking_lead_time_online_mins
          booking_lead_time_offline_mins
        }
      }
    }
    changemakerWorkhours(filters:{
      date: {
        eq: $date
      },
      users_permissions_user:{
        id: {
          eq: $id
        }
      }
    }){
      data{
        id
        attributes{
          To_Time
          From_time
          Mode
          is_disabled
          date
        }
      }
    }
    clientPackages(
      filters: {
        fitnesspackages: {
          users_permissions_user: { id: { eq: $id } }
          fitness_package_type: { type: { or: $type } }
        }
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
              }
            }
          }
          effective_date
          accepted_date
          fitnesspackages {
            data {
              id
              attributes {
                expiry_date
                fitness_package_type {
                  data {
                    id
                    attributes {
                      type
                    }
                  }
                }
                packagename
                groupstarttime
                groupendtime
                restdays
                ptonline
                ptoffline
                grouponline
                groupoffline
                recordedclasses
                duration
                Status
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
                fitnesspackages {
                  data {
                    id
                    attributes {
                      expiry_date
                      fitness_package_type {
                        data {
                          id
                          attributes {
                            type
                          }
                        }
                      }
                      packagename
                      groupstarttime
                      groupendtime
                      restdays
                      ptonline
                      ptoffline
                      grouponline
                      groupoffline
                      recordedclasses
                      duration
                      Status
                    }
                  }
                }
                fitnessprograms {
                  data {
                    id
                    attributes {
                      title
                      duration_days
                      rest_days
                      start_dt
                      level
                      events
                      description
                      renewal_dt
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
            }
          }
        }
      }
    }
  }
`;

export const GET_ALL_CHANGEMAKER_AVAILABILITY = gql`
  query getAllChangeMakerAvailabilityHolidays($id: ID!) {
    changemakerAvailabilties(filters: {
      users_permissions_user: {
        id: {
          eq: $id
        }
      }
    }){
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
`;

export const GET_ALL_CHANGEMAKER_AVAILABILITY_HOLIDAYS = gql`
  query getAllChangeMakerAvailabilityHolidays($id: ID!, $dateUpperLimit: Date, $dateLowerLimit: Date) {
    changemakerAvailabilties(filters: {
      date: { between: [$dateUpperLimit, $dateLowerLimit] }
      Is_Holiday: {
        eq: true
      },
      users_permissions_user: {
        id: {
          eq: $id
        }
      }
    }){
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
`;

export const GET_ALL_CHANGEMAKER_AVAILABILITY_WORKHOURS = gql`
  query getAllChangeMakerAvailabilityHolidays($id: ID!, $date: Date) {
    changemakerAvailabilties(filters: {
      date: { eq: $date }
      users_permissions_user: {
        id: {
          eq: $id
        }
      }
    }){
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
`;

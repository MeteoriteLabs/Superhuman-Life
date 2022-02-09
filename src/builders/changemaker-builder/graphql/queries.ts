import { gql } from "@apollo/client";

export const GET_ALL_CLIENT_PACKAGE_BY_TYPE = gql`
  query userPackages($id: ID!, $type: [String]) {
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
  query getUserWeeklyConfig($id: ID!) {
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
  }
`;

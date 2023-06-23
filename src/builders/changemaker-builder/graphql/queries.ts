import { gql } from "@apollo/client";

export const GET_ALL_CLIENT_PACKAGE_BY_TYPE = gql`
  query userPackages($id: ID!, $type: [String], $date: Date) {
    clientPackages(filters:{
      fitnesspackages: {
        users_permissions_user:{
          id: {
            eq: $id
          }
        },
        fitness_package_type: {
          type: {
            or: $type
          }
        }
      }
    }){
      data{
        id
        attributes{
          effective_date
          package_duration
          users_permissions_user{
            data{
              id
              attributes{
                username
                email
                Phone_Number
                Gender
                addresses{
                  data{
                    id
                    attributes{
                      city
                    }
                  }
                }
              }
            }
          },
          fitnesspackages{
            data{
              id
              attributes{
                packagename
                Status
                fitness_package_type{
                  data{
                    id
                    attributes{
                      type
                    }
                  }
                }
                users_permissions_user{
                  data{
                    id
                    attributes{
                      username
                    }
                  }
                }
                ptonline
                ptoffline
                grouponline
                groupoffline
                recordedclasses
                fitnesspackagepricing
              }
            }
          }
        }
      }
    }
    changemakerAvailabilties(filters: {
      date:{
        eq: $date
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

export const GET_ALL_WEEKLY_SESSIONOS = gql`
  query weeklySessions($id: ID!, $startDate: Date, $endDate: Date) {
    sessions(filters: {
      changemaker: {
        id: {
          eq: $id
        }
      },
      session_date: {
        between: [$startDate, $endDate]
      },
      type: {
        ne: "restday"
      },
    }){
      data{
        id
        attributes{
          mode
          start_time
          end_time
          tag
          type
          type
          session_date
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
          activity_target
        }
      }
    }
  }
`

export const GET_ALL_DAILY_SESSIONS = gql`
query getDailySessions($id: ID!, $Date: Date!){
  sessions(filters: {
    changemaker: {
      id: {
        eq: $id
      }
    },
    session_date: {
      eq: $Date
    },
    type: {
      ne: "restday"
    },
  }){
    data{
      id
      attributes{
        mode
        start_time
        end_time
        tag
        type
        type
        session_date
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
        activity_target
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
          
          booking_lead_time_online_mins
          booking_lead_time_offline_mins
        }
      }
    }
  }
`;

export const GET_ALL_CHANGEMAKER_AVAILABILITY = gql`
  query getAllChangeMakerAvailabilityHolidays($id: ID!, $limit: Int) {
    changemakerAvailabilties(filters: {
      users_permissions_user: {
        id: {
          eq: $id
        }
      }
    }, pagination: {pageSize: $limit}){
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

export const GET_SLOTS_TO_CHECK = gql`
query getAllChangeMakerAvailabilityHolidays($id: ID!, $dateUpperLimit: Date, $dateLowerLimit: Date) {
  changemakerAvailabilties(filters: {
    date: { between: [$dateUpperLimit, $dateLowerLimit] }
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
`

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

export const GET_CHANGEMAKER_AVAILABILITY_AND_TAGS = gql`
query changemakerAvailabilityAndTags($id: ID!, $date: Date!, $changemakerDate: Date!){
  sessions(filters:{
    changemaker:{
      id: {
        eq: $id
      }
    },
    session_date: {
      eq: $date
    }
  }){
    data{
      id
      attributes{
        mode
        start_time
        end_time
        tag
      }
    }
  }
  changemakerAvailabilties(filters:{
    date:{
      eq: $changemakerDate
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
        Is_Holiday
        booking_slots
        date
        holiday_title
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
`;
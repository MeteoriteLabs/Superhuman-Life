import { gql } from "@apollo/client";

export const GET_SESSION_AND_SESSION_BOOKINGS = gql`
query getSessionAndSessionsBookings($id: ID!) {
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
          Session_booking_status
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
                start_time
                end_time
                activity{
                  data{
                    id
                    attributes{
                      title
                    }
                  }
                }
                activity_target
                tag
                type
                mode
                session_date
                workout{
                  data{
                    id
                    attributes{
                        workouttitle
                        About
                        Benifits
                        fitnessdisciplines{
                            data{
                                id
                                attributes{
                                disciplinename
                                }
                            }
                        }
                        level
                        intensity
                        calories
                        warmup
                        mainmovement
                        cooldown
                        muscle_groups{
                            data{
                                id
                                attributes{
                                    name
                                }
                            }
                        }
                        equipment_lists{
                            data{
                                id
                                attributes{
                                    name
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

export const GET_SESSIONS_BASED_ON_DATE = gql`
  query getSessionsBasedOnDate($date: Date!, $id: ID!) {
    sessions(filters: {
      changemaker: {
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
          start_time
        }
      }
    }
  }
`;

export const GET_TAG_BASED_ON_SESSION = gql`
  query getTagBasedOnSession($id: ID!) {
    tags(filters: {
      sessions: {
        id: {
          eq: $id
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
                address{
                  data{
                    id
                    attributes{
                      address1
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

export const GET_PARTICULAR_CLIENT = gql`
  query getParticularClient($id: ID!, $username: String){
    sessionsBookings(filters: {
      session: {
        id: {
          eq: $id
        }
      },
      client: {
        username: {
          containsi: $username
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
                Gender
              }
            }
          }
        }
      }
    }
  }
`
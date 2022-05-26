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
`
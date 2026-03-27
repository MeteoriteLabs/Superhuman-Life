import { gql } from '@apollo/client';

export const GET_CLIENT_SESSIONS = gql`
    query getClientSessions($id: ID!, $startDate: Date, $endDate: Date) {
            sessionsBookings(
            filters: {
                client: { id: { eq: $id } }
                session: {
                    session_date: { gte: $startDate, lte: $endDate }
                    Is_restday: { eq: false }
                }
            }
        ) {
            data {
                id
                attributes {
                    client {
                        data {
                            id
                            attributes {
                                username
                            }
                        }
                    }
                    session {
                        data {
                            id
                            attributes {
                                type
                                session_date
                                tag
                                end_time
                                Is_restday
                                start_time
                                mode
                                IndustrySession{
                                    data{
                                      id
                                      attributes{
                                        title
                                      }
                                    }
                                  }
                                activity {
                                    data {
                                        id
                                        attributes {
                                            title
                                        }
                                    }
                                }
                                activity_target
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
            }
        }
    }
`;

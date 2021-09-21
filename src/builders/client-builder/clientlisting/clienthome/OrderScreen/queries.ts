import { gql } from "@apollo/client";
export const GET_BOOKINGS = gql`
     query clientBookings($id: ID!, $start: Int, $limit: Int) {
          clientBookings(
               where: { fitnesspackages: { users_permissions_user: { id: $id } } }
               sort: "booking_date:desc"
               start: $start
               limit: $limit
          ) {
               id
               users_permissions_user {
                    username
               }
               effective_date
               booking_status
               booking_date
               booking_status
               package_duration
               fitnesspackages {
                    id
                    packagename
                    aboutpackage
                    tags
                    fitness_package_type {
                         type
                    }
                    ptonline
                    ptoffline
                    grouponline
                    groupoffline
                    recordedclasses
                    fitnesspackagepricing {
                         packagepricing
                    }
               }
               program_managers {
                    id
                    fitnesspackages {
                         id
                         packagename
                         tags
                         aboutpackage
                         fitness_package_type {
                              type
                         }
                         ptonline
                         ptoffline
                         grouponline
                         groupoffline
                         recordedclasses
                         fitnesspackagepricing {
                              packagepricing
                         }
                    }
                    fitnessprograms {
                         id
                         title
                         description
                    }
               }
          }
     }
`;

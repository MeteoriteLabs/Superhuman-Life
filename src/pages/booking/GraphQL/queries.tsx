import {gql} from "@apollo/client";



export const GET_ALL_BOOKINGS = gql `
query clientBookings($id: ID!, $start:Int, $limit:Int) {
  clientBookings(
      where: {
        fitnesspackages: {
          users_permissions_user: { id: $id }
        }
      }
      sort: "booking_date:desc"
      start:$start
      limit:$limit
    ) 
    {
      id
      users_permissions_user {
        username
      }
      effective_date
      booking_status
      booking_date
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
`



export const FILTER_PACKAGES = gql `
query userPackages($id: ID!, $sorts:String) {
    userPackages(
      where: {
        fitnesspackages: {
          users_permissions_user: { id: $id }
        }
      },
      sort: $sorts
    
    ) 
    {
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
`



export const BOOKING_CONFIG = gql`
  query bookingConfigs($id: ID!){
    bookingConfigs(
      where:{
        fitnesspackage:{users_permissions_user: { id: $id}}
      }
    )
    {
      id
      fitnesspackage{
        packagename
        fitness_package_type{
          type
        }
      }
      isAuto
      bookingsPerDay
      BookingsPerMonth
    }
  }

`






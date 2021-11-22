import { gql } from "@apollo/client"



export const GET_ALL_SUGGESTED_PRICING = gql`
    query suggestedPricings($id:ID!){
        suggestedPricings(
            where:{users_permissions_users:{id:$id}}
        )
    {
        id
        updatedAt
        Mode
        fitness_package_type{
            type
        }
        mrp
    }
}
`

export const GET_ALL_VOUCHERS = gql`
    query vouchers($id: ID){
        vouchers(
            where:{users_permissions_user:{ id: $id }}
        )
    {
        id
        voucher_name
        discount_percentage
        expiry_date
        Start_date
        Usage_restriction
        Status
    }
}
`


export const GET_VOUCHERS_BY_ID = gql`
    query vouchers($id: ID!){
        vouchers(where:{ id: $id}){
            voucher_name
            discount_percentage
            expiry_date
            Start_date
            Usage_restriction
            Status
        }
}
`




export const GET_ALL_BOOKINGS_FINANCE = gql `
query clientBookings($id: ID!) {
  clientBookings(
      where: {
        fitnesspackages: {
          users_permissions_user: { id: $id }
        }
      }
    ) 
    {
      id
      users_permissions_user {
        username
        Phone
        addresses{
          address1
          city
          state
          country
          zipcode
        }
      }
      package_duration
      effective_date
      booking_status
      booking_date
      package_duration
      fitnesspackages {
        id
        packagename
        mode
        fitness_package_type {
          type
        }
        fitnesspackagepricing{
            packagepricing
          }
        users_permissions_user {
          id
          Phone
          Firstname
          Lastname
          email
        }

        ptoffline
        ptonline
        grouponline
        groupoffline
        recordedclasses
      }
    }
  }
`



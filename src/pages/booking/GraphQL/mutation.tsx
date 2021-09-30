import { gql } from '@apollo/client'




export const UPDATE_BOOKING_CONFIG = gql`
    mutation updateBookingConfig(
        $id:ID!
        $isAuto:Boolean 
        $bookingsPerDay:Int 
        $BookingsPerMonth:Int
        )
    {
        updateBookingConfig(
            input:{
                where:{id: $id}
                data:{
                    isAuto:$isAuto
                    bookingsPerDay:$bookingsPerDay
                    BookingsPerMonth:$BookingsPerMonth
                }
            }
        )
        {
            bookingConfig{
                isAuto
                bookingsPerDay
                BookingsPerMonth
            }
        }
    }
`


export const UPDATE_BOOKING_STATUS = gql`
    mutation  updateClientBooking(
        $id:ID!
        $booking_status:ENUM_CLIENTBOOKINGS_BOOKING_STATUS
    )
    {
        updateClientBooking(
            input:{
                where: { id : $id }
                data:{
                    booking_status:$booking_status
                }
            }
        )
        {
            clientBooking{
                id
                users_permissions_user {
                    id
                }
                effective_date
                booking_status
                booking_date
                package_duration
                fitnesspackages {
                    id
                }
                program_managers{
                    id
                }
            }
        }
    }
`


export const CREATE_USER_PACKAGE = gql`
    mutation createUserPackage(
        $users_permissions_user:ID
        $fitnesspackages: [ID]
        $accepted_date: DateTime!
        $package_duration: Int!
        $effective_date: DateTime!
        $program_managers: [ID]
    )
    {
        createUserPackage(
            input:{
                data:{
                    users_permissions_user:$users_permissions_user
                    fitnesspackages: $fitnesspackages
                    accepted_date:$accepted_date
                    package_duration:$package_duration
                    effective_date:$effective_date
                    program_managers:$program_managers
                }
            }
        )
        {
            userPackage{
                id
                users_permissions_user{
                    id
                }
                fitnesspackages{
                    id
                }
                accepted_date
                package_duration
                effective_date
                program_managers{
                    id
                }
            }
        }
    }
  


`
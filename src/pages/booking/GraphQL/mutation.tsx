import {gql} from '@apollo/client'




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
                booking_status
            }
        }
    }
   
    
`
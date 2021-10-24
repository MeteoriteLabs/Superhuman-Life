import {gql} from '@apollo/client'



export const CREATE_VOUCHER = gql`
    mutation createVoucher(
        $voucher_name:String
        $discount_percentage:Float
        $expiry_date:DateTime
        $Start_date:DateTime
        $Usage_restriction:Int
        $users_permissions_user:ID
        $Status:ENUM_VOUCHERS_STATUS
    ){
        createVoucher(
            input:{
                data:{
                    voucher_name: $voucher_name
                    discount_percentage: $discount_percentage
                    expiry_date: $expiry_date
                    Start_date: $Start_date
                    Usage_restriction:$Usage_restriction
                    users_permissions_user: $users_permissions_user
                    Status:$Status
                }
            }
        ){
            voucher{
                id
                voucher_name
                discount_percentage
                expiry_date
                Start_date
                Usage_restriction
            }
        }
    }
`

export const EDIT_VOUCHER = gql`
    mutation updateVoucher(
        $id:ID!
        $voucher_name:String
        $discount_percentage:Float
        $expiry_date:DateTime
        $Start_date:DateTime
        $Usage_restriction:Int
        $users_permissions_user:ID
    ){
        updateVoucher(
            input:{
                where:{ id: $id}
                data:{ 
                    voucher_name: $voucher_name
                    discount_percentage: $discount_percentage
                    expiry_date: $expiry_date
                    Start_date: $Start_date
                    Usage_restriction:$Usage_restriction
                    users_permissions_user: $users_permissions_user
                }
            }
        ){
            voucher{
                id
                voucher_name
                discount_percentage
                expiry_date
                Start_date
                Usage_restriction
            }
        }
    }
`


export const DELETE_VOUCHER = gql`
    mutation deleteVoucher($id: ID!){
        deleteVoucher(
            input:{
                where:{ id: $id}
            }
        ){
            voucher{
                id
            }
        }
    }
`

export const TOGGLE_STATUS = gql`
    mutation updateVoucher(
        $id:ID!
        $Status:ENUM_VOUCHERS_STATUS
    ){
        updateVoucher(
            input:{
                where:{ id: $id}
                data:{ 
                    Status: $Status
                }
            }
        ){
            voucher{
                id
                voucher_name
                Status
            }
        }
    }   
`

export const UPDATE_FITNESS_PRICING_ASSITS = gql`
    mutation updateSuggestedPricing(
        $id:ID!
        $mrp:Float
    ){
        updateSuggestedPricing(
            input:{
                where:{ id: $id}
                data:{
                    mrp:$mrp
                }
            }
        ){
            suggestedPricing{
                mrp
            }
        }
    }
`
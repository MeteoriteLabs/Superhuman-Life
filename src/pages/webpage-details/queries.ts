import { gql } from "@apollo/client";

export const CREATE_WEBPAGE_DETAILS = gql`
    mutation createWebsiteDataum(
        $brand_name: String
        $address: ID
        $email: String
        $phone: String
    ) {
        createWebsiteDataumInput (
            input: {
                data: {
                    brand_name:$brand_name
                    address : $address
                    email : $email
                    phone : $phone
                }
            }
        )
        {
            websiteData {
                brand_name
                address
            }   
        }
    
    }

`;
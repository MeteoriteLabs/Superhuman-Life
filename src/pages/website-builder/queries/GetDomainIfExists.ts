import { gql } from '@apollo/client';

export const GET_BLACKLISTED_DOMAINS = gql`
query SapienSubdomain($subdomain: String) {
    sapienSubdomains(
      filters: {
       SubdomainBySapien: {eq: $subdomain}
      }
    ) {
      data {
        id
           attributes{
          SubdomainBySapien
          
        }
    }
  }
}`
  
  export const GET_CHANGEMAKER_WEBSITE_SUBDOMAIN = gql`
  query getChangemakerWebsiteSubdomain($subdomain: String){
    changemakerWebsites(filters: {subdomain: {eq: $subdomain}}){
      data{
        attributes{
          subdomain
        }
      }
    }
  }`
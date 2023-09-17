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
  
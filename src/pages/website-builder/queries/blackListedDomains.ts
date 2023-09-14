import { gql } from '@apollo/client';

export const BLACKLISTED_SUBDOMAINS = gql`
query BlackListedSubdomains{
    sapienSubdomains{
     data{
       attributes{
         SubdomainBySapien
       }
     }
   }
 }`
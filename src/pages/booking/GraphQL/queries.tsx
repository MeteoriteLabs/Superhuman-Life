import {gql} from "@apollo/client";



export const GET_ALL_PACKAGES = gql `
query userPackages($id: ID!) {
    userPackages(
      where: {
        fitnesspackages: {
          users_permissions_user: { id: $id }
        }
      }
      sort: "purchase_date:desc"
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









import {gql} from "@apollo/client";



export const GET_ALL_PACKAGES = gql `
query userPackages($id: ID!) {
    userPackages(
      where: {
        fitnesspackages: {
          users_permissions_user: { id: $id }
        }
      }
      sort: "fitnesspackages.id"
    ) {
      id
      users_permissions_user {
        username
      }
      effective_date
      purchase_date
      fitnesspackages {
        duration
        expiry_date
        packagename
        duration
        Status
        fitnesspackagepricing{
            packagepricing
        }
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






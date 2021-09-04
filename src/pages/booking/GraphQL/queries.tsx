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
      package_duration
      effective_date
      purchase_date
      fitnesspackages {
        expiry_date
        packagename
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






import { gql } from "@apollo/client";

export const GET_USER_INDUSTRIES_AND_OFFERINGS = gql`
query GetUserIndustriesAndOfferings($userId: ID) {
    usersPermissionsUser(id: $userId) {
      data {
        id
        attributes {
          industries {
            data {
              attributes {
                IndustryName
              }
            }
          }
          fitnesspackages {
            data {
              id
              attributes {
                packagename
                websiteVisibility
                Industry {
                  data {
                    attributes {
                      IndustryName
                      IndustryDescription
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`  

export const UPDATE_PACKAGE_VISIBILITY = gql`
mutation updatePackageVisibility($fitnessPackageId: ID!,$websiteVisibility:Boolean ) {
    updateFitnesspackage(id: $fitnessPackageId, data: {
      websiteVisibility: $websiteVisibility
    }) {
      data{
        id
      }
    }
  }`
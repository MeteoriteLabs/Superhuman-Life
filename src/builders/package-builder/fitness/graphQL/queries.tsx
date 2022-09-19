import { gql } from "@apollo/client";

export const GET_ADDRESS = gql`
  query fitnessdisciplines($userId: ID) {
    addresses(filters:{users_permissions_user: {id: {eq: $userId}}}){
      data{
        id
        attributes{
          address1
          address2
          city
          state
          zipcode
          country
        }
      }
    }
  }
`;

export const GET_FITNESS_DISCIPLINES = gql`
  query fitnessdisciplines {
    fitnessdisciplines {
      data {
        id
        attributes {
          disciplinename
        }
      }
    }
  }
`;

export const GET_FITNESS_PACKAGE_TYPES = gql`
  query fitnessPackageTypes($type: String) {
    fitnessPackageTypes(filters: {
      type: {
        eq: $type
      }
    }){
      data{
        id
        attributes{
          type
        }
      }
    }
  }
`;

export const GET_FITNESS = gql`
  query fitnesspackages($id: ID!) {
    fitnesspackages(
      sort: ["updatedAt"]
      filters: { users_permissions_user: { id: { eq: $id } } }
      pagination: {pageSize: 1000}
    ) {
      data {
        id
        attributes {
          packagename
          ptoffline
          ptonline
          mode
          groupoffline
          grouponline
          recordedclasses
          bookingleadday
          bookingleadtime
          fitness_package_type {
            data {
              id
              attributes {
                type
              }
            }
          }
          users_permissions_user {
            data {
              id
            }
          }
          fitnessdisciplines {
            data {
              attributes {
                disciplinename
              }
            }
          }
          fitnesspackagepricing
          duration
          Status
          is_private
        }
      }
    }
  }
`;

export const GET_SINGLE_PACKAGE_BY_ID = gql`
  query fitnesspackage($id: ID!) {
    fitnesspackages(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          packagename
          tags
          level
          aboutpackage
          Intensity
          Is_free_demo
          languages{
            data{
              id
              attributes{
                languages
              }
            }
          }
          fitnessdisciplines{
            data{
              id
              attributes{
                disciplinename
              }
            }
          }
          equipment_lists {
            data{
              id
              attributes{
                name
              }
            }
          }
          benefits
          mode
          Start_date
          Course_details
          End_date
          ptoffline
          ptonline
          groupoffline
          grouponline
          recordedclasses
          bookingleadday
          video_URL
          Upload_ID
          Thumbnail_ID
          equipment_lists{
            data{
              id
              attributes{
                name
              }
            }
          }
          restdays
          bookingleadtime
          groupstarttime
          groupendtime
          groupinstantbooking
          address {
            data {
              id
              attributes{
                address1
              }
            }
          }
          Ptclasssize
          classsize
          fitness_package_type {
            data {
              id
              attributes {
                type
              }
            }
          }
          users_permissions_user {
            data {
              id
            }
          }
          fitnessdisciplines {
            data {
              id
              attributes {
                disciplinename
              }
            }
          }
          fitnesspackagepricing
          duration
          Status
          mode
          is_private
          expiry_date
          publishing_date
          residential_type
          booking_config{
            data{
              id
              attributes{
                isAuto
                BookingsPerMonth
                is_Fillmyslots
                bookingsPerDay
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SUGGESTIONS_PRICES = gql`
  query suggestedPricings($id: ID) {
    suggestedPricings(
      filters: { users_permissions_users: { id: { eq: $id } } }
    ) {
      data {
        id
        attributes {
          Mode
          mrp
          fitness_package_type {
            data {
              attributes {
                type
              }
            }
          }
          users_permissions_users {
            data {
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_SAPIENT_PRICES = gql`
  query sapienPricings {
    sapienPricings{
      data{
        id
        attributes{
          mode
          mrp
          fitness_package_type{
            data{
              id
              attributes{
                type
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_FITNESS_PACKAGE_TYPE = gql`
  query fitnessPackageType {
    fitnessPackageTypes{
      data{
        id
        attributes{
          type
        }
      }
    }
  }
`;

export const LANGUAGES = gql`
    query fetchLanguages {
        languages(pagination: {pageSize: 1000}){
            data{
              id
              attributes{
                languages
              }
            }
          }
    }
`;

export const ADD_SUGGESTION_NEW = gql`
mutation createSuggestion($id: ID, $fitnesspackage: ID){
     createUserPackageSuggestion(data: {
       users_permissions_user: $id,
       fitnesspackage: $fitnesspackage
     }){
       data{
         id
       }
     }
   }
`;
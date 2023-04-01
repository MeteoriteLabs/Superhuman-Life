import { gql } from "@apollo/client";

export const GET_ADDRESS = gql`
  query fitnessdisciplines($userId: ID) {
    addresses(filters: { users_permissions_user: { id: { eq: $userId } } }) {
      data {
        id
        attributes {
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

export const GET_BOOKINGS_CONFIG = gql`
  query bookingConfigs($userId: ID) {
    bookingConfigs(
      pagination: { pageSize: 1000 }
      filters: {
        fitnesspackage: { users_permissions_user: { id: { eq: $userId } } }
      }
    ) {
      data {
        id
        attributes {
          fitnesspackage {
            data {
              id
              attributes {
                packagename
              }
            }
          }
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
    fitnessPackageTypes(filters: { type: { eq: $type } }) {
      data {
        id
        attributes {
          type
          Modes
          PricingRequired
          Unit_Pricing_Calculation
          suggested_pricings {
            data {
              id
              attributes {
                mrp
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_TAGS = gql`
  query getTags($id: ID!) {
    tags(
      filters: {
        fitnesspackage: { users_permissions_user: { id: { eq: $id } } }
      }
    ) {
      data {
        id
        attributes {
          tag_name
          sessions {
            data {
              id
              attributes {
                session_date
                type
              }
            }
          }
          fitnesspackage {
            data {
              id
              attributes {
                packagename
                duration
                mode
                Status
                Start_date
                End_date
                fitnesspackagepricing
                packagename
                ptoffline
                ptonline
                mode
                publishing_date
                expiry_date
                groupoffline
                grouponline
                recordedclasses
                bookingleadday
                groupinstantbooking
                bookingleadtime
                fitness_package_type {
                  data {
                    id
                    attributes {
                      type
                    }
                  }
                }
              }
            }
          }
          client_packages {
            data {
              id
              attributes {
                effective_date
                accepted_date
                users_permissions_user {
                  data {
                    id
                    attributes {
                      username
                      First_Name
                      Last_Name
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
`;

export const GET_FITNESS = gql`
  query fitnesspackages($id: ID) {
    fitnesspackages(
      sort: ["updatedAt"]
      filters: { users_permissions_user: { id: { eq: $id } } }
      pagination: { pageSize: 1000 }
    ) {
      data {
        id
        attributes {
          Thumbnail_ID
          SubscriptionDuration
          packagename
          ptoffline
          ptonline
          Start_date
          End_date
          mode
          publishing_date
          groupoffline
          grouponline
          recordedclasses
          bookingleadday
          groupinstantbooking
          bookingleadtime
          level
          users_permissions_user{
            data{
              id
              attributes{
                First_Name
                Last_Name
                username
              }
            }
          }
          address{
            data{
              id
              attributes{
                address1
                city
                state
              }
            }
          }
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
  query fitnesspackage($id: ID) {
    fitnesspackages(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          SubscriptionDuration
          packagename
          tags
          level
          aboutpackage
          Accomdation_details
          Intensity
          Is_free_demo
          languages {
            data {
              id
              attributes {
                languages
              }
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
          equipment_lists {
            data {
              id
              attributes {
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
          equipment_lists {
            data {
              id
              attributes {
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
              attributes {
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
          booking_config {
            data {
              id
              attributes {
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
    sapienPricings {
      data {
        id
        attributes {
          mode
          mrp
          fitness_package_type {
            data {
              id
              attributes {
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
    fitnessPackageTypes {
      data {
        id
        attributes {
          type
        }
      }
    }
  }
`;

export const LANGUAGES = gql`
  query fetchLanguages {
    languages(pagination: { pageSize: 1000 }) {
      data {
        id
        attributes {
          languages
        }
      }
    }
  }
`;

export const ADD_SUGGESTION_NEW = gql`
  mutation createSuggestion($id: ID, $fitnesspackage: ID) {
    createUserPackageSuggestion(
      data: { users_permissions_user: $id, fitnesspackage: $fitnesspackage }
    ) {
      data {
        id
      }
    }
  }
`;

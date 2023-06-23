import { gql } from '@apollo/client';

export const UPDATE_CLIENT_BOOKING = gql`
  mutation updateClientBooking($id: ID!, $data: ClientBookingInput!) {
    updateClientBooking(id: $id, data: $data) {
      data {
        id
        attributes {
          booking_date
          package_duration
          effective_date
          Booking_status
        }
      }
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation createTransaction($data: TransactionInput!) {
    createTransaction(data: $data) {
      data {
        id
      }
    }
  }
`;

export const GET_CLIENT_BOOKING = gql`
  query clientBookingQuery($id: ID) {
    clientBooking(id: $id) {
      data {
        id
        attributes {
          package_duration
          effective_date
          ClientUser {
            data {
              id
              attributes {
                First_Name
                Last_Name
                Phone_Number
                email
              }
            }
          }
          fitnesspackages {
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

                address {
                  data {
                    id
                    attributes {
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
      }
    }
  }
`;

export const GET_TAG = gql`
  query tags($fitnessPackageId: ID) {
    tags(filters:{fitnesspackage:{id:{eq: $fitnessPackageId}}} ) {
      data {
        id
        attributes{
          fitnesspackage{
            data{
              id
              attributes{
                packagename
              }
            }
          }
        }     
      }
    }
  }
`;

export const GET_OFFERING_INVENTORIES = gql`
  query offeringInventoriesQuery($changemaker_id: String, $fitnessPackage_id: ID) {
    offeringInventories(
      filters: {
        changemaker_id: { eq: $changemaker_id }
        fitnesspackage: { id: { eq: $fitnessPackage_id } }
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
                classsize
              }
            }
          }
          ActiveBookings
          ClassAvailability
          ClassSize
          ClientBookingDetails
        }
      }
    }
  }
`;

export const CREATE_SESSION_BOOKING = gql`
  mutation createSessionsBooking($data: SessionsBookingInput!) {
    createSessionsBooking(data: $data){
        data{
          id
        }
      }
  }
`;

export const UPDATE_TAG = gql`
  mutation updateTag($id: ID!, $data: TagInput!) {
    updateTag(id: $id, data: $data){
        data{
          id
        }
      }
  }
`;

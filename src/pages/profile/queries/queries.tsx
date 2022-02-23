import { gql } from "@apollo/client";

export const FETCH_USER_PROFILE_DATA = gql`
  query fetchUserProfileData($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        attributes {
          First_Name
          Last_Name

          Phone_Number
          Photo_ID
          About_User
          instagram_url
          Facebook_URL
          Youtube_URL
          LinkedIn_URL
          Clubhouse_URL
          Twitter_URL
          Verification_ID
          Photo_profile_banner_ID
          educational_details {
            data {
              id
              attributes {
                Institute_Name
                Type_of_degree
                Specialization
                Year
              }
            }
          }
          addresses {
            data {
              id
              attributes {
                city
                address1
                address2
                type
                zipcode
                country
                state
              }
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_USER_PROFILE_DATA = gql`
  mutation updateUserProfileData($id: ID!, $data: UsersPermissionsUserInput!) {
    updateUsersPermissionsUser(id: $id, data: $data) {
      data {
        attributes {
          Phone_Number
        }
      }
    }
  }
`;

export const UPDATE_ADDRESS_DATA = gql`
  mutation updateAddressData($id: ID!, $data: AddressInput!) {
    updateAddress(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation createAddress($data: AddressInput!) {
    createAddress(data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation deleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      data {
        id
      }
    }
  }
`;

export const CREATE_EDUCATION_DETAILS = gql`
  mutation createEducationDetails($data: EducationalDetailInput!) {
    createEducationalDetail(data: $data) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_EDUCATION_DETAILS = gql`
  mutation updateEducationData($id: ID!, $data: EducationalDetailInput!) {
    updateEducationalDetail(id: $id, data: $data) {
      data {
        id
      }
    }
  }
`;

export const DELETE_EDUCATION_DETAILS = gql`
  mutation deleteEducationData($id: ID!) {
    deleteEducationalDetail(id: $id) {
      data {
        id
      }
    }
  }
`;

//{
//     "1": {
//         "type": "object",
//         "properties": {
//             "firstName": {
//                 "type": "string",
//                 "title": "First Name"
//             },
//             "lastName": {
//                 "type": "string",
//                 "title": "Last Name"
//             },
//             "about": {
//                 "type": "string",
//                 "title": "About"
//             },
//             "miniDescription": {
//                 "type": "string",
//                 "title": "Mini Description"
//             },
//             "address": {
//                 "type": "array",
//                 "title": "Address",
//                 "items": {
//                     "type": "object",
//                     "properties": {
//                         "address": {
//                             "type": "string",
//                             "title": "Address"
//                         }
//                     }
//                 }
//             },
//             "contactNumber": {
//                 "type": "string",
//                 "title": "Contact Number"
//             },
//             "uploadProfilePicture": {
//                 "type": "string",
//                 "title": "Upload Profile Picture"
//             },
//             "uploadProfileBanner": {
//                 "type": "string",
//                 "title": "Upload Profile Banner"
//             },
//             "instagram": {
//                 "type": "string",
//                 "title": "Instagram Link"
//             },
//             "youtubeLink": {
//                 "type": "string",
//                 "title": "Youtube Link"
//             },
//             "twitterLink": {
//                 "type": "string",
//                 "title": "Twitter Link"
//             },
//             "linkedIn": {
//                 "type": "string",
//                 "title": "LinkedIn Link"
//             },
//             "clubHouseLink": {
//                 "type": "string",
//                 "title": "ClubHouse Link"
//             },
//             "verificationID": {
//                 "type": "string",
//                 "title": "Verification ID"
//             }
//         }
//     }
// }

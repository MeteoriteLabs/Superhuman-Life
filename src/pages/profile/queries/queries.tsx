import { gql } from '@apollo/client';

export const FETCH_USER_PROFILE_DATA = gql`
  query fetchUserProfileData($id: ID!) {
    usersPermissionsUser(id: $id) {
      data {
        id
        attributes {
          First_Name
          Last_Name
          email
          Phone_Number
          Photo_ID
          About_User
          Website_URL
          about_mini_description
          Document_Verified
          updatedAt
          designations {
            data {
              id
              attributes {
                Designation_title
                description
              }
            }
          }
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
                Title
                type_address
                House_Number
                is_primary
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
        id
      }
    }
  }
`;

export const UPDATE_ADDRESS_DATA = gql`
  mutation updateAddressData($id: ID!, $data: AddressInput!) {
    updateAddress(id: $id, data: $data) {
      data {
        id
        attributes {
          is_primary
        }
      }
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation createAddress($data: AddressInput!) {
    createAddress(data: $data) {
      data {
        id
        attributes {
          address1
          address2
          city
          country
          zipcode
          state
          is_primary
        }
      }
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation deleteAddress($id: ID!) {
    deleteAddress(id: $id) {
      data {
        id
        attributes {
          is_primary
        }
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
        attributes {
          is_primary
        }
      }
    }
  }
`;

export const FETCH_USERS_PROFILE_DATA = gql`
  query fetchUsersProfileData($id: ID) {
    usersPermissionsUsers(pagination: { pageSize: 100 }, filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          First_Name
          Last_Name
          email
          Phone_Number
          Photo_ID
          About_User
          Website_URL
          about_mini_description
          designations {
            data {
              id
              attributes {
                Designation_title
                description
              }
            }
          }
          instagram_url
          Facebook_URL
          Youtube_URL
          LinkedIn_URL
          Clubhouse_URL
          Twitter_URL
          Verification_ID
          Photo_profile_banner_ID
          educational_details(pagination: { pageSize: 100 }) {
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
          addresses(pagination: { pageSize: 100 }) {
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
                Title
                type_address
                House_Number
                is_primary
              }
            }
          }
        }
      }
    }
  }
`;

export const ADDRESSES_IS_PRIMARY = gql`
  query addresses($id: ID, $is_primary: Boolean) {
    addresses(
      pagination: { pageSize: 1000 }
      filters: { users_permissions_user: { id: { eq: $id } }, is_primary: { eq: $is_primary } }
    ) {
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
          Title
          type_address
          House_Number
          is_primary
        }
      }
    }
  }
`;

export const ADDRESS = gql`
  query address($id: ID) {
    address(id: $id) {
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
          Title
          type_address
          House_Number
          is_primary
        }
      }
    }
  }
`;

export const ADDRESSES = gql`
  query Addresses($id: ID, $start: Int, $limit: Int) {
    addresses(
      pagination: { start: $start, limit: $limit }
      filters: { users_permissions_user: { id: { eq: $id } } }
    ) {
      meta{
        pagination{
          pageCount
          total
        }
      }
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
          Title
          type_address
          House_Number
          is_primary
        }
      }
    }
  }
`;

export const EDUCATIONAL_DETAILS = gql`
  query educationalDetails($id: ID, $start: Int, $limit: Int) {
    educationalDetails(
      pagination: { start: $start, limit: $limit }
      filters: { users_permissions_user: { id: { eq: $id } } }
    ) {
      meta{
        pagination{
          pageCount
          total
        }
      }
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
  }
`;

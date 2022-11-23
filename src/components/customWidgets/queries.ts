import { gql } from "@apollo/client";

export const DESIGNATIONS = gql`
    query fetchDesignations {
        designations(pagination: {pageSize:1000}){
            data{
                id
                attributes{
                    Designation_title
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

export const ORGANIZATION_TYPE = gql`
    query getchOrg {
        organizationTypes(pagination: {pageSize: 1000}){
            data{
            id
            attributes{
            Org_title_name
            }
        }
        }
    }
`;

export const GET_PROGRAMLIST = gql`
query programlistQuery($id: ID!, $filter: String!) {
    fitnessprograms(
    filters: {
        Is_program: { eq: true }
        users_permissions_user: { id: { eq: $id } }
        title: { containsi: $filter }
    }
    ) {
    data {
        id
        attributes {
        title
        duration_days
        level
        description
        events
        fitnessdisciplines {
        data {
            id
            attributes {
            disciplinename
            }
        }
        }
        users_permissions_user {
        data {
            id
        }
        }
        }
    }
    }
}
`;

export const GET_FITNESSPACKAGE_DETAILS = gql`
query fitnesspackageQuery {
    fitnessPackageTypes(sort:["id"]){
        data{
          id
          attributes{
            type
          }
        }
    }
}
`;

export const GET_TAGS_BY_TYPE = gql`
query getTagByType($type: String!, $id: ID!) {
    tags(filters: {
        fitnesspackage: {
        users_permissions_user: {
            id: {
            eq: $id
            }
        },
        fitness_package_type: {
            type: {
            eq: $type
            }
        }
        }
    }){
        data{
        id
        attributes{
            tag_name
        }
        }
    }
}
`;

export const GET_SESSIONS_BY_TAG = gql`
query getSessionsByTag($id: ID!) {
    tags(filters: {
        id: {
          eq: $id
        }
      }){
        data{
          id
          attributes{
            client_packages{
              data{
                id
                attributes{
                  effective_date
                  accepted_date
                  users_permissions_user{
                    data{
                      id
                      attributes{
                        username
                        First_Name
                        Last_Name
                      }
                    }
                  }
                }
              }
            }
            fitnesspackage{
              data{
                id
                attributes{
                  duration
                  Start_date
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
            sessions(filters: {
              Is_restday: {
                eq: false
              }
            }){
              data{
                id
                attributes{
                  tag
                  type
                  start_time
                  day_of_program
                  end_time
                  mode
                  activity_target
                  Is_program_template
                  session_date
                  activity{
                    data{
                      id
                      attributes{
                        title
                      }
                    }
                  }
                  workout{
                    data{
                      id
                      attributes{
                        workouttitle
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

export const GET_TIMEZONES = gql`
query getTimezones{
  timezones(pagination: {pageSize: 200}){
    data{
      id
      attributes{
        time
        name
      }
    }
  }
}
`

export const GET_EQUIPMENTLIST = gql`
  query equipmentListQuery{
    equipmentLists(pagination: {
      pageSize:100
    }){
      data{
        id
        attributes{
          name
        }
      }
    }
  }
`
export const GET_MUSCLEGROUPS = gql`
     query muscleGroupQuery{
          muscleGroups(pagination: {
            pageSize:100
          }){
          data {
               id
               attributes {
               name
               }
          }
          }
     }
  `;

  export const GET_CONTACTS = gql`
  query ContactsQuery($id: ID){
    contacts(pagination: { pageSize: 100 }, filters:{
      ownedBy:{
        id: {eq: $id}
      },
      isPayee:{
        eq: false
      }
    } ) {
      data {
        id
        attributes {
          firstname
          lastname
          email
          type
          phone
          createdAt
          ownedBy{
            data{
              id
            }
          }
          appDownloadStatus
          paymentDetails
          organisationDetails
          isPayee
        }
      }
    }
  }
`;

export const FETCH_CHANGEMAKERS = gql`
  query fetchUsersProfileData{
    usersPermissionsUsers(pagination: { pageSize: 100 }  
      ) {
      data {
        id
        attributes {
          username
          First_Name
          Last_Name
          email
          Phone_Number
          Photo_ID
          About_User
          Website_URL
          about_mini_description
          designations{
            data{
              id
              attributes{
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
          educational_details(pagination:{pageSize:100}) {
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
          addresses(pagination:{pageSize:100}) {
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
              }
            }
          }
        }
      }
    }
  }
`;


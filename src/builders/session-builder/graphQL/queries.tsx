import { gql } from "@apollo/client";

export const GET_ALL_CLIENT_PACKAGE_BY_TYPE = gql`
  query userPackages($id: ID!, $type: String) {
    clientPackages(
      filters: {
        fitnesspackages: {
          users_permissions_user: { id: { eq: $id } }
          fitness_package_type: { type: { eq: $type } }
        }
      }
      sort: ["fitnesspackages.id"]
    ) {
      data {
        id
        attributes {
          users_permissions_user {
            data {
              id
              attributes {
                username
              }
            }
          }
          effective_date
          accepted_date
          fitnesspackages {
            data {
              id
              attributes {
                expiry_date
                fitness_package_type {
                  data {
                    id
                    attributes {
                      type
                    }
                  }
                }
                packagename
                groupstarttime
                groupendtime
                restdays
                ptonline
                ptoffline
                grouponline
                groupoffline
                recordedclasses
                duration
                Status
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
                fitnesspackages {
                  data {
                    id
                    attributes {
                      expiry_date
                      fitness_package_type {
                        data {
                          id
                          attributes {
                            type
                          }
                        }
                      }
                      packagename
                      groupstarttime
                      groupendtime
                      restdays
                      ptonline
                      ptoffline
                      grouponline
                      groupoffline
                      recordedclasses
                      duration
                      Status
                    }
                  }
                }
                fitnessprograms {
                  data {
                    id
                    attributes {
                      title
                      duration_days
                      rest_days
                      start_dt
                      level
                      description
                      renewal_dt
                      fitnessdisciplines {
                        data {
                          id
                          attributes {
                            disciplinename
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
      }
    }
  }
`;

export const GET_ALL_FITNESS_PACKAGE_BY_TYPE = gql`
  query fitnesspackages($id: ID!, $type: String) {
    fitnesspackages(
      filters: {
        users_permissions_user: { id: { eq: $id } }
        fitness_package_type: { type: { eq: $type } }
      }
    ) {
      data {
        id
        attributes {
          packagename
          expiry_date
          Status
          duration
          ptonline
          ptoffline
          grouponline
          groupoffline
          restdays
          recordedclasses
          groupstarttime
          groupendtime
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

export const GET_ALL_PROGRAM_BY_TYPE = gql`
  query programManagers($id: ID!, $type: String) {
    programManagers(
      filters: {
        fitnesspackages: {
          users_permissions_user: { id: { eq: $id } }
          fitness_package_type: { type: { eq: $type } }
        }
      }
    ) {
      data {
        id
        attributes {
          fitnesspackages {
            data {
              id
              attributes {
                packagename
                expiry_date
          Status
          duration
          ptonline
          ptoffline
          grouponline
          groupoffline
          restdays
          recordedclasses
          groupstarttime
          groupendtime
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
          fitnessprograms {
            data {
              id
              attributes {
                title
                duration_days
                rest_days
                start_dt
                level
                events
                description
                renewal_dt
                fitnessdisciplines {
                  data {
                    id
                    attributes {
                      disciplinename
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

export const GET_ALL_CLIENT_PACKAGE = gql`
  query userPackages($id: ID!, $type: String) {
    clientPackages(
      filters: {
        fitnesspackages: {
          users_permissions_user: { id: { eq: $id } }
          fitness_package_type: { type: { eq: $type } }
        }
      }
    ) {
      data {
        id
        attributes {
          users_permissions_user {
            data {
              id
              attributes {
                username
              }
            }
          }
          effective_date
          accepted_date
          fitnesspackages {
            data {
              id
              attributes {
                expiry_date
                fitness_package_type {
                  data {
                    id
                    attributes {
                      type
                    }
                  }
                }
                packagename
                groupstarttime
                groupendtime
                restdays
                ptonline
                ptoffline
                grouponline
                groupoffline
                recordedclasses
                duration
                Status
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
                fitnesspackages {
                  data {
                    id
                    attributes {
                      expiry_date
                      fitness_package_type {
                        data {
                          id
                          attributes {
                            type
                          }
                        }
                      }
                      packagename
                      groupstarttime
                      groupendtime
                      restdays
                      ptonline
                      ptoffline
                      grouponline
                      groupoffline
                      recordedclasses
                      duration
                      Status
                    }
                  }
                }
                fitnessprograms {
                  data {
                    id
                    attributes {
                      title
                      duration_days
                      rest_days
                      start_dt
                      level
                      description
                      renewal_dt
                      fitnessdisciplines {
                        data {
                          id
                          attributes {
                            disciplinename
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
      }
    }
  }
`;

export const GET_ALL_CLASSIC_CLIENT_BY_ID = gql`
  query userPackages($id: ID!) {
    clientPackages(filters: { fitnesspackages: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          users_permissions_user {
            data {
              id
              attributes {
                username
              }
            }
          }
          effective_date
          accepted_date
          fitnesspackages {
            data {
              id
              attributes {
                expiry_date
                fitness_package_type {
                  data {
                    id
                    attributes {
                      type
                    }
                  }
                }
                packagename
                groupstarttime
                groupendtime
                restdays
                ptonline
                ptoffline
                grouponline
                groupoffline
                recordedclasses
                duration
                Status
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
                fitnesspackages {
                  data {
                    id
                    attributes {
                      expiry_date
                      fitness_package_type {
                        data {
                          id
                          attributes {
                            type
                          }
                        }
                      }
                      packagename
                      groupstarttime
                      groupendtime
                      restdays
                      ptonline
                      ptoffline
                      grouponline
                      groupoffline
                      recordedclasses
                      duration
                      Status
                    }
                  }
                }
                fitnessprograms {
                  data {
                    id
                    attributes {
                      title
                      duration_days
                      rest_days
                      start_dt
                      level
                      description
                      renewal_dt
                      fitnessdisciplines {
                        data {
                          id
                          attributes {
                            disciplinename
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
      }
    }
  }
`;

export const GET_ALL_GROUP_CLIENT_BY_ID = gql`
  query userPackages($id: ID!) {
    clientPackages(filters: { program_managers: { id: { eq: $id } } }) {
      data {
        id
        attributes {
          users_permissions_user {
            data {
              id
              attributes {
                username
              }
            }
          }
          effective_date
          accepted_date
          fitnesspackages {
            data {
              id
              attributes {
                expiry_date
                fitness_package_type {
                  data {
                    id
                    attributes {
                      type
                    }
                  }
                }
                packagename
                groupstarttime
                groupendtime
                restdays
                ptonline
                ptoffline
                grouponline
                groupoffline
                recordedclasses
                duration
                Status
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
                fitnesspackages {
                  data {
                    id
                    attributes {
                      expiry_date
                      fitness_package_type {
                        data {
                          id
                          attributes {
                            type
                          }
                        }
                      }
                      packagename
                      groupstarttime
                      groupendtime
                      restdays
                      ptonline
                      ptoffline
                      grouponline
                      groupoffline
                      recordedclasses
                      duration
                      Status
                    }
                  }
                }
                fitnessprograms {
                  data {
                    id
                    attributes {
                      title
                      duration_days
                      rest_days
                      start_dt
                      level
                      description
                      renewal_dt
                      fitnessdisciplines {
                        data {
                          id
                          attributes {
                            disciplinename
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
      }
    }
  }
`;

export const GET_ALL_FITNESSDISCIPLINES = gql`
  query Fitnessdisciplines {
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

export const GET_ALL_FITNESSEQUIPMENT = gql`
  query equipmentLists {
    equipmentLists {
      data {
        id
        attributes {
          name
        }
      }
    }
  }
`;

export const FETCH_FITNESSDISCPLINES = gql`
  query fitnessdiscplines {
    fitnessdisciplines(sort: ["updatedAt"]) {
      data {
        id
        attributes {
          disciplinename
          updatedAt
        }
      }
    }
  }
`;

export const GET_TABLEDATA = gql`
  query getprogramdata($id: ID!) {
    fitnessprograms(filters: { id: { eq: $id } }) {
      data {
        id
        attributes {
          title
          duration_days
          rest_days
          start_dt
          level
          description
          events
          renewal_dt
          fitnessdisciplines {
            data {
              id
              attributes {
                disciplinename
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_TAGS_FOR_GROUP = gql`
query getTagsforGroup($id: ID!) {
  tags(filters: {
    fitnesspackage: {
      users_permissions_user: {
        id: {
          eq: $id
        }
      },
      fitness_package_type: {
        type: {
          eq: "Group Class"
        }
      }
    }
  }){
    data{
      id
      attributes{
        tag_name
        sessions{
          data{
            id
            attributes{
              day_of_program
              tag
              type
              end_time
              start_time
              mode
              session_date
              activity{
                data{
                  id
                  attributes{
                    title
                  }
                }
              }
              activity_target
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
                  }
                }
              }
              fitnesspackages{
                data{
                  id
                  attributes{
                    packagename
                    duration
                    mode
                    Status
                    expiry_date
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

export const GET_TAGS_FOR_CLASSIC = gql`
query getTagsforGroup($id: ID!) {
  tags(filters: {
    fitnesspackage: {
      users_permissions_user: {
        id: {
          eq: $id
        }
      },
      fitness_package_type: {
        type: {
          eq: "Classic Class"
        }
      }
    }
  }){
    data{
      id
      attributes{
        tag_name
        fitnesspackage{
          data{
            id
            attributes{
              packagename
              duration
              mode
              Status
            }
          }
        }
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
      }
    }
  }
}
`;

export const GET_TAGS_FOR_CHANNEL = gql`
query getTagsforGroup($id: ID!) {
  tags(filters: {
    fitnesspackage: {
      users_permissions_user: {
        id: {
          eq: $id
        }
      },
      fitness_package_type: {
        type: {
          eq: "Live Stream Channel"
        }
      }
    }
  }){
    data{
      id
      attributes{
        tag_name
        sessions{
          data{
            id
            attributes{
              session_date
              type
            }
          }
        }
        fitnesspackage{
          data{
            id
            attributes{
              packagename
              duration
              mode
              Status
            }
          }
        }
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
      }
    }
  }
}
`;

export const GET_TAGS_FOR_COHORT = gql`
query getTagsforGroup($id: ID!) {
  tags(filters: {
    fitnesspackage: {
      users_permissions_user: {
        id: {
          eq: $id
        }
      },
      fitness_package_type: {
        type: {
          eq: "Cohort"
        }
      }
    }
  }){
    data{
      id
      attributes{
        tag_name
        sessions{
          data{
            id
            attributes{
              session_date
              type
            }
          }
        }
        fitnesspackage{
          data{
            id
            attributes{
              packagename
              duration
              mode
              Status
              Start_date
              End_date
            }
          }
        }
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
      }
    }
  }
}
`;


export const GET_TAG_BY_ID = gql`
query getTagById($id: ID!) {
  tags(filters: {
    id: {
      eq: $id
    }
  }){
    data{
      id
      attributes{
        tag_name
        fitnesspackage{
          data{
            id
            attributes{
              packagename
              duration
              mode
              level
              Status
              expiry_date
              ptonline
              ptoffline
              grouponline
              groupoffline
              recordedclasses
              restdays
              Start_date
              End_date
              Status
              residential_type
            }
          }
        }
        sessions{
          data{
            id
            attributes{
              day_of_program
              tag
              type
              end_time
              start_time
              Is_restday
              mode
              session_date
              activity{
                data{
                  id
                  attributes{
                    title
                  }
                }
              }
              activity_target
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


export const GET_SESSIONS_FROM_TAGS = gql`
query getSessionsFromTags($id: ID!, $tagType: String!){
  tags(filters: {
    client_packages: {
      fitnesspackages: {
        users_permissions_user: {
          id: {
            eq: $id
          }
        },
        fitness_package_type: {
          type: {
            eq: $tagType
          }
        }
      }
    }
  }){
    data{
      id
      attributes{
        tag_name
        sessions{
          data{
            id
            attributes{
              day_of_program
              tag
              type
              end_time
              start_time
              Is_restday
              mode
              session_date
              activity{
                data{
                  id
                  attributes{
                    title
                  }
                }
              }
              activity_target
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
                  }
                }
              }
              fitnesspackages{
                data{
                  id
                  attributes{
                    packagename
                    duration
                    mode
                    Status
                    expiry_date
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

export const GET_CLIENTS_BY_TAG = gql`
query getClientsGroup($id: ID!) {
  tags(filters: {
    id: {
      eq: $id
    }
  }){
    data{
      id
      attributes{
        sessions{
          data{
            id
            attributes{
              tag
            }
          }
        }
        fitnesspackage{
          data{
            id
            attributes{
              packagename
              duration
              level
              Start_date
              End_date
              Status
              residential_type
            }
          }
        }
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
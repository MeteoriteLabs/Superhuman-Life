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
                      duration
                      Status
                      ptonline
                      ptoffline
                      grouponline
                      groupoffline
                      restdays
                      recordedclasses
                      groupstarttime
                      groupendtime
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
                duration
                Status
                ptonline
                ptoffline
                grouponline
                groupoffline
                restdays
                recordedclasses
                groupstarttime
                groupendtime
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
          fitnesspackages {
            data {
              id
              attributes {
                packagename
                duration
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
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
          fitnesspackages {
            data {
              id
              attributes {
                packagename
                duration
              }
            }
          }
          program_managers {
            data {
              id
              attributes {
                fitnessprograms {
                  data {
                    id
                    attributes {
                      title
                      duration_days
                      rest_days
                      start_dt
                      events
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
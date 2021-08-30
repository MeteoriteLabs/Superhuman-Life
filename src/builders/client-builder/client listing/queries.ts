import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
     query getmessage($filter: String!, $id: String) {
          userPackages(
               where: {
                    users_permissions_user: { username_contains: $filter }
                    fitnesspackages: { users_permissions_user: { id: $id } }
               }
          ) {
               id
               effective_date
               package_duration
               users_permissions_user {
                    username
                    email
                    phone
                    addresses {
                         city
                    }
               }
               fitnesspackages {
                    packagename
                    Status
                    fitness_package_type {
                         type
                    }
                    users_permissions_user {
                         id
                    }
               }
               fitnessprograms {
                    description
                    updatedAt
               }
          }
     }
`;

export const ADD_CLIENT = gql`
     mutation client(
          $package_duration: Int!
          $purchase_date: DateTime!
          $fitnessprograms: [ID]
          $fitnesspackages: [ID]
          $user_permissions_user: ID
     ) {
          createUserPackageInput(
               input: {
                    data: {
                         package_duration: $package_duration
                         purchase_date: $purchase_date
                         fitnessprograms: $fitnessprograms
                         fitnesspackages: $fitnesspackages
                         users_permissions_user: $user_permissions_user
                    }
               }
          ) {
               userPackage {
                    package_duration
                    purchase_date
                    fitnessprograms
                    fitnesspackages
               }
          }
     }
`;

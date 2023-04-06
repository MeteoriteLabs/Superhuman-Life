import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
    mutation registerUser($email: String!, $password: String!, $name: String!) {
        register(input: {
            email: $email,
            username: $name,
            password: $password
          }){
            user{
              id
            }
          }
    }
`

export const UPDATE_USER = gql`
    mutation updateUser(
        $userid: ID!
        $fname: String, 
        $lname: String, 
        $email: String!, 
        $password: String, 
        $phone: String, 
        $uname: String!, 
        $dob: Date, 
        $gender: ENUM_USERSPERMISSIONSUSER_GENDER,
        $about: String,
        $module_permissions: JSON
        $languages: [ID]
        $timezone: ID
    ){
        updateUsersPermissionsUser(
            id: $userid
            data: {
                First_Name: $fname,
                email: $email,
                password: $password,
                Last_Name: $lname,
                username: $uname,
                DOB: $dob,
                Gender: $gender,
                Phone_Number: $phone,
                About_User: $about,
                Modules_permission: $module_permissions
                languages: $languages,
                timezone: $timezone
        }){
            data{
                id
            }
        }
    }
`

export const CREATE_USER = gql`
    mutation createUsersPermissionsUser(
        $fname: String, 
        $lname: String, 
        $email: String!, 
        $password: String, 
        $phone: String, 
        $uname: String!, 
        $dob: Date, 
        $gender: ENUM_USERSPERMISSIONSUSER_GENDER,
        $about: String,
        $module_permissions: JSON
        $languages: [ID]
    ) {
    createUsersPermissionsUser(
        data: {
        First_Name: $fname,
        email: $email,
        password: $password,
        Last_Name: $lname,
        username: $uname,
        DOB: $dob,
        Gender: $gender,
        Phone_Number: $phone,
        About_User: $about,
        Modules_permission: $module_permissions
        languages: $languages
        }){
        data{
            id
            attributes{
                First_Name
            }
        }
    }
}
`;

export const CREATE_ADDRESS = gql`
    mutation createAddress(
        $address1: String, 
        $address2: String, 
        $city: String, 
        $state: String, 
        $country: String, 
        $zipcode: String, 
        $Title: String,
        $user: ID,
        $latitude: String,
        $longitude: String
    ) {
        createAddress(
        data: {
        address1: $address1,
        address2: $address2,
        city: $city,
        state: $state,
        country: $country,
        zipcode: $zipcode,
        Title: $Title,
        users_permissions_user: $user,
        longitude: $longitude,
        latitude: $latitude
        }){
        data{
            id
        }
    }
}
`;

export const CREATE_ORGANIZATION = gql`
    mutation createOrganization(
        $Organization_Name: String, 
        $organization_type: [ID], 
        $Organization_description: String,
        $users: [ID]
    ) {
        createOrganization(data:{
            Organization_Name: $Organization_Name,
            organization_types: $organization_type,
            Organization_description: $Organization_description
            users: $users
          }){
            data{
              id
            }
          }
}
`;

export const CREATE_EDUCATION_DETAIL = gql`
    mutation createEducationalDetail(
        $Institute_Name: String, 
        $Type_of_degree: ENUM_EDUCATIONALDETAIL_TYPE_OF_DEGREE, 
        $Specialization: String,
        $year_of_passing: String,
        $user: ID
    ) {
        createEducationalDetail(data: {
            Institute_Name: $Institute_Name,
            Type_of_degree: $Type_of_degree,
            Specialization: $Specialization,
            Year: $year_of_passing,
            users_permissions_user: $user
          }){
            data{
              id
            }
          }
}
`;
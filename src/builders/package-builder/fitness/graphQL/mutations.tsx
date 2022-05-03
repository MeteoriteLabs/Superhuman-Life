import { gql } from "@apollo/client";

export const CREATE_PACKAGE = gql`
  mutation createFitnesspackage(
    $packagename: String
    $tags: String
    $level: ENUM_FITNESSPACKAGE_LEVEL
    $aboutpackage: String
    $benefits: String
    $introvideourl: String
    $mode: ENUM_FITNESSPACKAGE_MODE
    $address: ID
    $disciplines: [ID]
    $duration: Int
    $ptoffline: Int
    $ptonline: Int
    $grouponline: Int
    $groupoffline: Int
    $recordedclasses: Int
    $restdays: Int
    $bookingleadday: Int
    $bookingleadtime: String
    $groupinstantbooking: Boolean
    $fitness_package_type: ID
    $fitnesspackagepricing: JSON
    $ptclasssize: ENUM_FITNESSPACKAGE_PTCLASSSIZE
    $classsize: Int
    $users_permissions_user: ID!
    $publishing_date: DateTime
    $expiry_date: DateTime
  ) {
    createFitnesspackage(
      data:{
        packagename: $packagename
        tags: $tags
        level: $level
        aboutpackage: $aboutpackage
        benefits: $benefits
        introvideo: $introvideourl
        mode: $mode
        address: $address
        fitnessdisciplines: $disciplines
        duration: $duration
        ptoffline: $ptoffline
        ptonline: $ptonline
        grouponline: $grouponline
        groupoffline: $groupoffline
        recordedclasses: $recordedclasses
        restdays: $restdays
        bookingleadday: $bookingleadday
        bookingleadtime: $bookingleadtime
        groupinstantbooking: $groupinstantbooking
        fitness_package_type: $fitness_package_type
        fitnesspackagepricing: $fitnesspackagepricing
        Ptclasssize: $ptclasssize
        classsize: $classsize
        users_permissions_user: $users_permissions_user
        publishing_date: $publishing_date
        expiry_date: $expiry_date
      }
    ) {
      data{
        id
      }
    }
  }
`;

export const DELETE_PACKAGE = gql`
  mutation deleteFitnesspackage($id: ID!) {
    deleteFitnesspackage(id: $id) {
      data {
        id
      }
    }
  }
`;

export const UPDATE_PACKAGE_PRIVATE = gql`
  mutation updateFitnesspackage($id: ID!, $is_private: Boolean) {
    updateFitnesspackage(id: $id, data: { is_private: $is_private }) {
      data {
        id
      }
    }
  }
`;

export const EDIT_PACKAGE = gql`
  mutation fitnesspackages(
    $id: ID!
    $packagename: String
    $tags: String
    $level: ENUM_FITNESSPACKAGES_LEVEL
    $aboutpackage: String
    $benefits: String
    $introvideourl: String
    $mode: ENUM_FITNESSPACKAGES_MODE
    $ptoffline: Int
    $ptonline: Int
    $grouponline: Int
    $groupoffline: Int
    $recordedclasses: Int
    $restdays: Int
    $bookingleadday: Int
    $bookingleadtime: String
    $fitnesspackagepricing: [editComponentFitnesspackagepricingFitnesspackagepricingInput]
    $duration: Int
    $groupstarttime: String
    $groupendtime: String
    $groupinstantbooking: Boolean
    $address: ID
    $disciplines: [ID]
    $ptclasssize: ENUM_FITNESSPACKAGES_PTCLASSSIZE
    $classsize: Int
    $groupdays: String
    $fitness_package_type: ID
    $users_permissions_user: ID
    $Status: Boolean
    $is_private: Boolean
  ) {
    updateFitnesspackage(
      input: {
        where: { id: $id }
        data: {
          packagename: $packagename
          tags: $tags
          level: $level
          aboutpackage: $aboutpackage
          benefits: $benefits
          introvideourl: $introvideourl
          mode: $mode
          ptoffline: $ptoffline
          ptonline: $ptonline
          grouponline: $grouponline
          groupoffline: $groupoffline
          recordedclasses: $recordedclasses
          restdays: $restdays
          bookingleadday: $bookingleadday
          bookingleadtime: $bookingleadtime
          fitnesspackagepricing: $fitnesspackagepricing
          duration: $duration
          groupstarttime: $groupstarttime
          groupendtime: $groupendtime
          groupinstantbooking: $groupinstantbooking
          address: $address
          disciplines: $disciplines
          ptclasssize: $ptclasssize
          classsize: $classsize
          groupdays: $groupdays
          fitness_package_type: $fitness_package_type
          users_permissions_user: $users_permissions_user
          Status: $Status
          is_private: $is_private
        }
      }
    ) {
      fitnesspackage {
        id
      }
    }
  }
`;

export const CREATE_BOOKING_CONFIG = gql`
  mutation createBookingconfig($id: ID!, $isAuto: Boolean, $bookings_per_day: Int, $bookings_per_month: Int) {
    createBookingConfig(data: { isAuto: $isAuto, fitnesspackage: $id, bookingsPerDay: $bookings_per_day, BookingsPerMonth: $bookings_per_month }) {
      data {
        id
      }
    }
  }
`;

export const CREATE_CHANNEL_PACKAGE = gql`
  mutation createChannelPackage(
    $aboutpackage: String
    $benefits: String
    $packagename: String
    $channelinstantBooking: Boolean
    $expiry_date: DateTime
    $level: ENUM_FITNESSPACKAGE_LEVEL 
    $fitnesspackagepricing: JSON
    $publishing_date: DateTime
    $tags: String
    $users_permissions_user: ID
    $fitness_package_type: ID
    $is_private: Boolean
    $classsize: Int
    $address: ID
    $mode: ENUM_FITNESSPACKAGE_MODE 
    $residential_type: ENUM_FITNESSPACKAGE_RESIDENTIAL_TYPE 
  ){
    createFitnesspackage(data: {
      aboutpackage: $aboutpackage,
      benefits: $benefits,
      packagename: $packagename,
      groupinstantbooking: $channelinstantBooking,
      expiry_date: $expiry_date,
      level: $level,
      fitnesspackagepricing: $fitnesspackagepricing,
      publishing_date: $publishing_date,
      tags: $tags,
      users_permissions_user: $users_permissions_user,
      fitness_package_type: $fitness_package_type,
      is_private: $is_private,
      classsize: $classsize,
      address: $address
      mode: $mode,
      residential_type: $residential_type
    }){
      data{
        id
        attributes{
          packagename
        }
      }
    }
  }
`
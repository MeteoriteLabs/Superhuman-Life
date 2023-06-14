import PricingTableChannel from "./pricingTable";
import LocationList from "../../../../components/customWidgets/locationList";
import LanguageList from "../../../../components/customWidgets/languageSelect";
import ProgramDetails from "./ProgramDetails";
import CourseDetails from "../cohort/course_details";
import Upload from "../../../../components/upload/upload";
import DatesConfig from "../../../../components/customWidgets/datesConfig";
import FitnessSelect from "../../../../components/customWidgets/fitnessMultiSelect";
import EquipmentSelect from "../../../../components/customWidgets/equipmentListSelect";
import BookingConfig from "./bookingConfig";
import CohortDateConfig from "./eventDateConfig";
import CohortPrimaryDateConfig from "./primaryDatesConfig";

export const widgets = {
  pricingTableChannel: PricingTableChannel,
  locationList: LocationList,
  languageList: LanguageList,
  programDetails: ProgramDetails,
  courseDetails: CourseDetails,
  datesConfig: DatesConfig,
  fitnessSelect: FitnessSelect,
  equipmentSelect: EquipmentSelect,
  cohortBookingConfig: BookingConfig,
  cohortDateConfig: CohortDateConfig,
};

export const schema: any = {
  tag: {
    "ui:placeholder": "Enter tag name",
  },
  packageName: {
    "ui:placeholder": "Enter package name",
  },
  equipment: {
    "ui:widget": "equipmentSelect",
  },
  About: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "About the program",
  },
  Benifits: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "Benefits of the program",
  },
  languages: {
    "ui:widget": "languageList",
  },
  thumbnail: {
    "ui:widget": (props: any) => {
      return (
        <Upload
          allowImage={true}
          allowVideo={false}
          onChange={props.onChange}
          value={props.value}
          title={"Thumbnail"}
        />
      );
    },
  },
  datesConfig: {
    "ui:widget": "cohortDateConfig",
  },
  dates: {
    "ui:widget": (props: any) => {
      return (
        <CohortPrimaryDateConfig
          value={props.value}
          onChange={props.onChange}
        />
      );
    },
  },
  VideoUrl: {
    "ui:placeholder": "https://",
  },
  mode: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  location: {
    "ui:widget": "locationList",
  },
  description: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
  },
  programSchedule: {
    "ui:widget": "checkboxes",
  },
  pricing: {
    "ui:widget": "pricingTableChannel",
  },
  visibility: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  config: {
    bookingConfig: {
      "ui:widget": "cohortBookingConfig",
      "ui:disabled": true,
    },
  },
  programDetails: {
    "ui:widget": "programDetails",
  },
  courseDetails: {
    details: {
      "ui:widget": "courseDetails",
    },
  },
};

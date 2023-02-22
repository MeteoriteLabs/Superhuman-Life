import PricingTableChannel from "./pricingTableCohort";
import PreviewCohort from "./previewCohort";
import LocationList from "../../../../components/customWidgets/locationList";
import LanguageList from "../../../../components/customWidgets/languageSelect";
import ProgramDetails from "./programDetails";
import CourseDetails from "./course_details";
import Upload from "../../../../components/upload/upload";
import DatesConfig from "../../../../components/customWidgets/datesConfig";
import FitnessSelect from "../../../../components/customWidgets/fitnessMultiSelect";
import EquipmentSelect from "../../../../components/customWidgets/equipmentListSelect";
import BookingConfig from "./bookingConfig";
import CohortDateConfig from "./cohortDateConfig";

export const widgets = {
  pricingTableChannel: PricingTableChannel,
  previewCohort: PreviewCohort,
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

export const schemaView: any = {
  packageName: {
    "ui:readonly": true,
  },
  level: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  intensity: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  tag: {
    "ui:readonly": true,
  },
  discpline: {
    "ui:widget": "fitnessSelect",
    readonly: true,
  },
  equipment: {
    "ui:widget": "equipmentSelect",
    readonly: true,
  },
  About: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "About the program",
    "ui:readonly": true,
  },
  Benifits: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
    "ui:placeholder": "Benifits of the program",
    "ui:readonly": true,
  },
  languages: {
    "ui:widget": "languageList",
    "ui:readonly": true,
  },
  classSize: {
    "ui:readonly": true,
  },
  thumbnail: {
    "ui:widget": (props: any) => {
      return (
        <Upload
          allowImage={true}
          allowVideo={true}
          onChange={props.onChange}
          value={props.value}
          title={"Thumbnail"}
          readonly={true}
        />
      );
    },
  },
  datesConfig: {
    "ui:widget": "datesConfig",
    "ui:readonly": true,
  },
  dates: {
    "ui:widget": (props: any) => {
      return (
        <DatesConfig
          title1={"Start Date"}
          title2={"End Date"}
          value={props.value}
          onChange={props.onChange}
          readonly={true}
        />
      );
    },
  },
  Upload: {
    upload: {
      "ui:widget": (props: any) => {
        return (
          <Upload
            allowImage={true}
            allowVideo={true}
            onChange={props.onChange}
            value={props.value}
            readonly={true}
          />
        );
      },
    },
    VideoUrl: {
      "ui:placeholder": "https://",
      "ui:readonly": true,
    },
  },
  mode: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  location: {
    "ui:widget": "locationList",
    "ui:readonly": true,
  },
  residential: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  description: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 3,
    },
    "ui:readonly": true,
  },
  programSchedule: {
    "ui:widget": "checkboxes",
    "ui:readonly": true,
  },
  pricing: {
    "ui:widget": "pricingTableChannel",
    "ui:readonly": true,
  },
  visibility: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  config: {
    bookingConfig: {
      "ui:widget": "cohortBookingConfig",
      readonly: true,
    },
  },
  preview: {
    "ui:widget": "previewCohort",
    "ui:readonly": true,
  },
  programDetails: {
    "ui:widget": "programDetails",
    "ui:readonly": true,
  },
  courseDetails: {
    details: {
      "ui:widget": "courseDetails",
      "ui:readonly": true,
    },
  },
};

import Upload from "../../../../components/upload/upload";
import DatesConfig from "../../../../components/customWidgets/datesConfig";
import FitnessSelect from "../../../../components/customWidgets/fitnessMultiSelect";
import EquipmentSelect from "../../../../components/customWidgets/equipmentListSelect";
import LanguageList from "../../../../components/customWidgets/languageSelect";
import PtProgramDetails from "./ptProgramDetails";
import PTPricingTable from "./ptPricingTable";
import PTBookingConfig from "./bookingConfig";
import PTPreview from "./ptPreview";

export const widgets = {
  datesConfig: DatesConfig,
  fitnessSelect: FitnessSelect,
  equipmentSelect: EquipmentSelect,
  ptProgramDetails: PtProgramDetails,
  ptPricingTable: PTPricingTable,
  ptPreview: PTPreview,
  ptBookingConfig: PTBookingConfig,
  languageList: LanguageList,
};

export const schema: any = {
  disciplines: {
    "ui:widget": "fitnessSelect",
  },
  equipmentList: {
    "ui:widget": "equipmentSelect",
  },
  level: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  intensity: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  classSize: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  About: {
    "ui:widget": "textarea",
    "ui:autofocus": true,
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
  Upload: {
    upload: {
      "ui:widget": (props: any) => {
        return (
          <Upload
            allowImage={true}
            allowVideo={true}
            onChange={props.onChange}
            value={props.value}
          />
        );
      },
    },
    VideoUrl: {
      "ui:placeholder": "https://",
    },
  },
  programDetails: {
    "ui:widget": "ptProgramDetails",
  },
  pricingDetail: {
    "ui:widget": "ptPricingTable",
  },
  carousel: {
    "ui:widget": "ptPreview",
  },
  visibility: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
  },
  datesConfig: {
    "ui:widget": "datesConfig",
  },
  languages: {
    "ui:widget": "languageList",
  },
  config: {
    bookingConfig: {
      "ui:widget": "ptBookingConfig",
    },
  },
};

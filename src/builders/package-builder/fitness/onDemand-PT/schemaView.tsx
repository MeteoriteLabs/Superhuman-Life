import Upload from "../../../../components/upload/upload";
import DatesConfig from "../../../../components/customWidgets/datesConfig";
import FitnessSelect from "../../../../components/customWidgets/fitnessMultiSelect";
import EquipmentSelect from "../../../../components/customWidgets/equipmentListSelect";
import PtProgramDetails from "./onDemandProgramDetails";
import PTPricingTable from "./onDemandPricingtable";
import LanguageList from "../../../../components/customWidgets/languageSelect";

export const widgets = {
  datesConfig: DatesConfig,
  fitnessSelect: FitnessSelect,
  equipmentSelect: EquipmentSelect,
  ptProgramDetails: PtProgramDetails,
  ptPricingTable: PTPricingTable,
  languageList: LanguageList,
};

export const schemaView: any = {
  packagename: {
    "ui:readonly": true,
  },
  disciplines: {
    "ui:widget": "fitnessSelect",
    readonly: true,
  },
  equipmentList: {
    "ui:widget": "equipmentSelect",
    readonly: true,
  },
  tags: {
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
  classSize: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  bookingleadday: {
    "ui:readonly": true,
  },
  About: {
    "ui:widget": "textarea",
    "ui:autofocus": true,
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
    "ui:placeholder": "Benefits of the program",
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
  Upload: {
    "ui:readonly": true,
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
  programDetails: {
    "ui:widget": "ptProgramDetails",
    "ui:readonly": true,
  },
  pricingDetail: {
    "ui:widget": "ptPricingTable",
    "ui:readonly": true,
  },
  visibility: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
  datesConfig: {
    "ui:widget": "datesConfig",
    "ui:readonly": true,
  },
  languages: {
    "ui:widget": "languageList",
    "ui:readonly": true,
  },
  config: {
    "ui:widget": "radio",
    "ui:options": {
      inline: true,
    },
    "ui:readonly": true,
  },
};

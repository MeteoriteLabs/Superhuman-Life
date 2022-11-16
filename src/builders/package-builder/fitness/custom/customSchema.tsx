import Upload from '../../../../components/upload/upload';
import DatesConfig from '../../../../components/customWidgets/datesConfig';
import FitnessSelect from '../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../components/customWidgets/equipmentListSelect';
import LanguageList from '../../../../components/customWidgets/languageSelect';
import CustomProgramDetails from './customProgramDetails';
import CustomPricingTable from './customPricingTable';
import CustomPreview from './customPreview';
import CustomBookingConfig from './bookingConfig';

export const widgets = {
     datesConfig: DatesConfig,
     fitnessSelect: FitnessSelect,
     equipmentSelect: EquipmentSelect,
     customProgramDetails: CustomProgramDetails,
     customPricingTable: CustomPricingTable,
     customPreview: CustomPreview,
     customBookingConfig: CustomBookingConfig,
     customLanguageSelect: LanguageList,
}

export const schema: any = {  
     "disciplines": {
          "ui:widget": "fitnessSelect",
     },
     "equipmentList": {
          "ui:widget": "equipmentSelect",
     },
     "level": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
      },
     "intensity": {
          "ui:widget": "radio",
          "ui:options": {
              "inline": true
          }
     },
     "classSize": {
          "ui:widget": "radio",
          "ui:options": {
               "inline": true
          }
     },
     "About": {
          "ui:widget": "textarea",
          "ui:autofocus": true,
          "ui:options": {
              "rows": 3
          },
          "ui:placeholder": "About the program",
      },
      "Benifits": {
          "ui:widget": "textarea",
          "ui:options": {
              "rows": 3,
          },
          "ui:placeholder": "Benifits of the program",
      },
     "thumbnail": {
          "ui:widget": (props: any) => {
               return <Upload allowImage={true} allowVideo={false} onChange={props.onChange} value={props.value} title={'Thumbnail'} />;
          },
      },
     "Upload": {
          "upload": {
               "ui:widget": (props: any) => {
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
               },
          },  
          "VideoUrl": {
               "ui:placeholder": "https://"
          }
     },
     "programDetails": {
          "ui:widget": "customProgramDetails"
     },
     "pricingDetail": {
          "ui:widget": "customPricingTable"
     },
     "carousel": {
          "ui:widget": "customPreview"
     },
     "datesConfig": {
          "ui:widget": "datesConfig"
     },
     "visibility": {
          "ui:widget": "radio",
              "ui:options": {
                  "inline": true
              }
     },
     "languages": {
          "ui:widget": "customLanguageSelect"
     },
     "config": {
          "bookingConfig": {
              "ui:widget": "customBookingConfig"
          }
     },
}
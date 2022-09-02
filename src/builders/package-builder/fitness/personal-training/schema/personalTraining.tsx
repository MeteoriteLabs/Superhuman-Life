import Upload from '../../../../../components/upload/upload';
import DatesConfig from '../../create-edit/widgets/datesConfig';
import FitnessSelect from '../../../../../components/customWidgets/fitnessMultiSelect';
import EquipmentSelect from '../../../../../components/customWidgets/equipmentListSelect';
import PtProgramDetails from '../widgets/ptProgramDetails';

export const widgets = {
     datesConfig: DatesConfig,
     fitnessSelect: FitnessSelect,
     equipmentSelect: EquipmentSelect,
     ptProgramDetails: PtProgramDetails
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
          }
      },
      "Benifits": {
          "ui:widget": "textarea",
          "ui:options": {
              "rows": 3,
          },
      },
     "thumbnail": {
          "ui:widget": (props: any) => {
               return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} title={'Thumbnail'} />;
          },
      },
     "Upload": {
          "upload": {
               "ui:widget": (props: any) => {
                    console.log(props)
                    return <Upload allowImage={true} allowVideo={true} onChange={props.onChange} value={props.value} />;
               },
          },  
          "VideoUrl": {
               "ui:placeholder": "https://"
          }
     },
     "programDetails": {
          "ui:widget": "ptProgramDetails"
     },
}
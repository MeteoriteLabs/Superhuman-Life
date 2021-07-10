import TextEditor from '../search-builder/textEditor';
import EquipmentSearch from '../search-builder/equipmentList';
import MuscleGroupSearch from '../search-builder/muscleGroupList';
import FitnessSelect from './fitnessSelect';



let equipmentListarray: any;
function handleEquipmentCallback(data: any) {
    equipmentListarray = data;
}

let muscleGroupListarray: any;
function handleMuscleGroupCallback(data:any){
    muscleGroupListarray = data;
}

let fitnessDiscplinesListarray: any;
function handleFitnessDiscplinesListCallback(data: any){
    console.log(data);
    fitnessDiscplinesListarray = data;
}

export function valuesToCreateOrEdit() {
    return [fitnessDiscplinesListarray, muscleGroupListarray, editorTextString, equipmentListarray];
}

let editorTextString: any;
function handleEditorTextCallBack(data:any){
    editorTextString = data;
}

export const schema: any = {
          "level": {
              "ui:widget": "radio",
              "ui:options": {
                  "inline": true
              }
          },
          "description": {
              "ui:widget": "textarea",
              "ui:options": {
                  "rows": 3
              }
          },
          "miniDescription": {
              "ui:widget": "textarea",
              "ui:options": {
                  "rows": 3
              }
          },
          "equipment": {
              "ui:widget": () => {
                  return (
                      <div>
                          <EquipmentSearch equipmentList={handleEquipmentCallback}/>
                      </div>
                  )
              }
          },
          "muscleGroup": {
              "ui:widget": () => {
                  return (
                      <div>
                          <MuscleGroupSearch muscleGroupList={handleMuscleGroupCallback}/>
                      </div>
                  )
              }
          },
          "discipline": {
              "ui:widget": () => {
                  return (
                    <div>
                        <FitnessSelect fitnessdisciplinesList={handleFitnessDiscplinesListCallback}/>
                    </div>
                  )
              }
          },
          "addExercise": {
              "Add Text": {
                  "ui:widget": () => {
                      return (
                          <TextEditor editorText={handleEditorTextCallBack}/>
                      )
                  }
              },
              "Upload": {
                  "ui:options": {
                      "accept": ".mp4"
                  }
              }
         }
      }
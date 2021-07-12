import React, { useState } from 'react';
import { InputGroup, FormControl, Button } from 'react-bootstrap';


const ExerciseBuild = () => {

     const [reps, setReps] = useState<any[]>([]);
     const [sets, setSets] = useState<any[]>([]);
     const [weights, setWeights] = useState<any[]>([]);
     const [duration, setDuration] = useState<any[]>([]);

     // These functions handle the change in the input field
     function handleRepsChange(i: any, event: any){
          const values = [...reps];
          values[i].value = event.target.value;
          setReps(values);
     }

     function handleSetsChange(i: any, event: any){
          const values = [...sets];
          values[i].value = event.target.value;
          setSets(values);
     }

     function handleWeightsChange(i: any, event: any){
          const values = [...weights];
          values[i].value = event.target.value;
          setWeights(values);
     }

     function handleDurationChange(i: any, event: any){
          const values = [...duration];
          values[i].value = event.target.value;
          setDuration(values);
     }

     //These functions handle the adding of the input fields
     function handleRepsAdd(){
          const values = [...reps];
          values.push({ value: null});
          setReps(values);
     }

     function handleSetsAdd(){
          const values = [...sets];
          values.push({ value: null});
          setSets(values);
     }

     function handleWeightsAdd(){
          const values = [...weights];
          values.push({ value: null});
          setWeights(values);
     }

     function handleDurationAdd(){
          const values = [...duration];
          values.push({ value: null});
          setDuration(values);
     }

     //These functions handle the deletion of the input feilds
     function handleRepsRemove(i: any){
          const values = [...reps];
          values.splice(i, 1);
          setReps(values);
     }

     function handleSetsRemove(i: any){
          const values = [...sets];
          values.splice(i, 1);
          setSets(values);
     }

     function handleWeightsRemove(i: any){
          const values = [...weights];
          values.splice(i, 1);
          setWeights(values);
     }

     function handleDurationRemove(i: any){
          const values = [...duration];
          values.splice(i, 1);
          setDuration(values);
     }

     return (
          <div>
               <Button size="sm" className="m-1" variant="outline-secondary" type="button" onClick={() => handleRepsAdd()}>
                              Reps <i style={{ fontSize: 12}} className="fas fa-plus"></i>
               </Button>
               <Button size="sm" className="m-1" variant="outline-secondary" type="button" onClick={() => handleSetsAdd()}>
                              Sets <i style={{ fontSize: 12}} className="fas fa-plus"></i>
               </Button>
               <Button size="sm" className="m-1" variant="outline-secondary" type="button" onClick={() => handleDurationAdd()}>
                              Duration <i style={{ fontSize: 12}} className="fas fa-plus"></i>
               </Button>
               <Button size="sm" className="m-1" variant="outline-secondary" type="button" onClick={() => handleWeightsAdd()}>
                              Weight <i style={{ fontSize: 12}} className="fas fa-plus"></i>
               </Button>
                    {reps.map((field, idx) => {
                         return (
                              <div key={`${field}-${idx}`}>
                              <InputGroup className="m-1">
                                   <FormControl
                                        type="number"
                                        placeholder="Number of reps"
                                        value={field.value || ""}
                                        onChange={e => handleRepsChange(idx, e)}
                                   />
                                   <InputGroup.Append>
                                        <Button variant="light" onClick={() => handleRepsRemove(idx)}>
                                             <i style={{fontSize: '14px'}} className="close fas fa-times"></i>
                                        </Button>
                                   </InputGroup.Append>
                                   </InputGroup>
                              </div>
                         );
                    })}
                    {sets.map((field, idx) => {
                         return (
                              <div key={`${field}-${idx}`}>
                              <InputGroup className="m-1">
                                   <FormControl
                                        type="number"
                                        placeholder="Number of sets"
                                        value={field.value || ""}
                                        onChange={e => handleSetsChange(idx, e)}
                                   />
                                   <InputGroup.Append>
                                        <Button variant="light" onClick={() => handleSetsRemove(idx)}>
                                             <i style={{fontSize: '14px'}} className="close fas fa-times"></i>
                                        </Button>
                                   </InputGroup.Append>
                                   </InputGroup>
                              </div>
                         );
                    })}
                    {duration.map((field, idx) => {
                         return (
                              <div key={`${field}-${idx}`}>
                              <InputGroup className="m-1">
                                   <FormControl
                                        type="number"
                                        placeholder="Duration"
                                        value={field.value || ""}
                                        onChange={e => handleDurationChange(idx, e)}
                                   />
                                   <InputGroup.Append>
                                        <Button variant="light" onClick={() => handleDurationRemove(idx)}>
                                             <i style={{fontSize: '14px'}} className="close fas fa-times"></i>
                                        </Button>
                                   </InputGroup.Append>
                                   </InputGroup>
                              </div>
                         );
                    })}
                    {weights.map((field, idx) => {
                         return (
                              <div key={`${field}-${idx}`}>
                              <InputGroup className="m-1">
                                   <FormControl
                                        type="number"
                                        placeholder="Weight"
                                        value={field.value || ""}
                                        onChange={e => handleWeightsChange(idx, e)}
                                   />
                                   <InputGroup.Append>
                                        <Button variant="light" onClick={() => handleWeightsRemove(idx)}>
                                             <i style={{fontSize: '14px'}} className="close fas fa-times"></i>
                                        </Button>
                                   </InputGroup.Append>
                                   </InputGroup>
                              </div>
                         );
                    })}
          </div>
     );
}

export default ExerciseBuild;
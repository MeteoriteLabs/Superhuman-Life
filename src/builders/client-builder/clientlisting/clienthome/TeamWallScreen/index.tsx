import { useRef, useState } from "react";
import { Card, Button } from "react-bootstrap";
import CardComp from "./Card";
import CreatePost from "./addPost";
import { GET_CHANGEMAKERS_NEW } from "../../queries";
import { GET_NOTES_NEW } from "./queries";
import { useQuery } from "@apollo/client";
import "./Styles.css";
import { flattenObj } from "../../../../../components/utils/responseFlatten";

function Index() {
     const last = window.location.pathname.split("/").pop();
     const CreatePostComponent = useRef<any>(null);
     const [changemaker, setChangemaker] = useState<any>([]);
     const [notes, setNotes] = useState<any>();

     function FetchData(_variables: Record<string, unknown> = { clientid: last }) {
          useQuery(GET_CHANGEMAKERS_NEW, { variables: _variables, onCompleted: loadData });
     }
     function loadData(data: any) {
          const flattenData = flattenObj({...data})
          
          const changemakers: any = [];
          const namearr: any = [];
          let flag: any;

          [...flattenData.clientPackages].map((Detail) => {
               const changemakerValue = {};
               const img = "img";
               const type = "type";
               const id = "id";
               const name = Detail.fitnesspackages[0].users_permissions_user.username;
               if (!namearr.includes(name)) {
                    flag = true;
                    namearr.push(name);
               }

               if (flag) {
                    flag = false;
                    changemakers.push([
                         name,
                         (changemakerValue[img] = "/assets/avatar-1.jpg"),
                         (changemakerValue[type] = Detail.fitnesspackages[0].users_permissions_user?.designations),
                         (changemakerValue[id] = Detail.fitnesspackages[0].users_permissions_user.id),
                    ]);
               }
               setChangemaker(changemakers);

               return {};
          });
     }

     function FetchNotes(_variables: Record<string, unknown> = { id: last }) {
          useQuery(GET_NOTES_NEW, { variables: _variables, onCompleted: LoadNotes });
     }

     function LoadNotes(data: any) {
          const flattenData = flattenObj({ ...data });
          if (data) {
               setNotes([...flattenData.feedbackNotes]);
          }
     }

     FetchData({ clientid: last });

     // for (let i = 0; i < changemaker.length; i++) {
     //      noteFetch.push(changemaker[i][3]);
     // }

     // if (!noteFetch.includes(last)) {
     //      noteFetch.push(last);
     // }
     FetchNotes({ id: last });
     return (
          <div>
               <div className="d-flex flex-row-reverse mr-3 p-2">
                    <Button
                         variant="btn btn-light"
                         onClick={() => {
                              CreatePostComponent.current.TriggerForm({
                                   id: null,
                                   type: "create",
                              });
                         }}
                    >
                         <i className="fas fa-plus-circle"></i> Post
                    </Button>
                    <CreatePost ref={CreatePostComponent}></CreatePost>
               </div>
               <Card>
                    <Card.Header>
                         <h5>Changemakers</h5>
                    </Card.Header>

                    <Card.Body>
                         <div className="changemakerRow">
                              {changemaker &&
                                   changemaker.map((e: any, index) => {
                                        return (
                                             <div className="changemaker" key={index}>
                                                  <div>
                                                       <img
                                                            src={e[1]}
                                                            height="70"
                                                            className="rounded-circle ml-1"
                                                            alt="avatar"
                                                       />
                                                  </div>

                                                  <div className="d-flex flex-column changemakerText">
                                                       <h6 className="mt-2 font-weight-bold">{e[0]}</h6>
                                                       <h6 className="desc font-weight-light">{e[2]} </h6>
                                                  </div>
                                             </div>
                                        );
                                   })}
                         </div>
                    </Card.Body>
               </Card>

               {notes &&
                    notes.map((e: any, index) => {
                         
                         return (
                              <CardComp
                                   key={index}
                                   comments={e.feedback_comments}
                                   userName={e.users_permissions_user.username}
                                   designation={e.users_permissions_user.designation}
                                   updatedOn={e.updatedAt}
                                   note={e.note}
                                   id={e.id}
                                   resourceid={e.resource_id}
                              />
                         );
                    })}
          </div>
     );
}

export default Index;

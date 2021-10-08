import { useRef, useState } from "react";
import { Card, Row, Button } from "react-bootstrap";
import CardComp from "./Card";
import CreatePost from "./addPost";
import { GET_CHANGEMAKERS } from "../../queries";
import { useQuery } from "@apollo/client";
import "./Styles.css";
//import AuthContext from "../../../../../context/auth-context";

function Index() {
     const last = window.location.pathname.split("/").pop();
     //const auth = useContext(AuthContext);
     const CreatePostComponent = useRef<any>(null);
     const [changemaker, setChangemaker] = useState<any>([]);

     function FetchData(_variables: {} = { clientid: last }) {
          useQuery(GET_CHANGEMAKERS, { variables: _variables, onCompleted: loadData });
     }
     function loadData(data: any) {
          let changemakers: any = [];
          let namearr: any = [];
          let flag: any;

          [...data.userPackages].map((Detail) => {
               let changemakerValue = {};
               let img = "img";
               let type = "type";
               let name = Detail.fitnesspackages[0].users_permissions_user.username;
               if (!namearr.includes(name)) {
                    flag = true;
                    namearr.push(name);
               }

               if (flag) {
                    flag = false;
                    changemakers.push([
                         name,
                         (changemakerValue[img] = "/assets/avatar-1.jpg"),
                         (changemakerValue[type] = Detail.fitnesspackages[0].users_permissions_user.designation),
                    ]);
               }
               setChangemaker(changemakers);
               return {};
          });
     }
     FetchData({ clientid: last });

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
                    <Card.Body>
                         <h5>Changemakers</h5>
                    </Card.Body>

                    <Card.Header>
                         <Row>
                              {changemaker &&
                                   changemaker.map((e: any, index) => {
                                        //console.log(e);
                                        return (
                                             <div className="changemaker d-flex flex-column" key={index}>
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
                         </Row>
                    </Card.Header>
               </Card>
               <CardComp />
               <CardComp />
          </div>
     );
}

export default Index;

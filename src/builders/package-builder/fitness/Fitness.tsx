import { useMemo, useState, useContext, useRef } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  TabContent,
  DropdownButton,
  Dropdown,
  ProgressBar,
} from "react-bootstrap";
import Table from "../../../components/table";
import AuthContext from "../../../context/auth-context";
import "./fitness.css";
import ActionButton from "../../../components/actionbutton";
import CreateEditViewPersonalTraining from "./personal-training/CreateEditView";
import CreateEditViewOnDemandPt from "./onDemand-PT/CreateEditView";
import CreateEditViewGroupClass from "./group/CreateEditView";
import CreateEditViewClassicClass from "./classic/CreateOrEdit";
import CreateEditViewCustomFitness from "./custom/CreateOrEdit";
import CreateEditViewChannel from "./live-stream/CreateEditView-Channel";
import CreateEditViewCohort from "./cohort/CreateEditView-Cohort";
import { GET_FITNESS, GET_TAGS } from "./graphQL/queries";
import { flattenObj } from "../../../components/utils/responseFlatten";
import moment from "moment";
import OfferingsDisaplyImage from "../../../components/customWidgets/offeringsDisplayImage";
import Drawer from "../../../components/Drawer";
import DrawerTrigger from "../../../components/Drawer/DrawerTrigger";
import Backdrop from "../../../components/Drawer/Backdrop";

export default function FitnessTab() {
  const auth = useContext(AuthContext);
  const createEditViewPersonalTrainingRef = useRef<any>(null);
  const CreateEditViewOnDemandPtRef = useRef<any>(null);
  const CreateEditViewGroupClassRef = useRef<any>(null);
  const CreateEditViewClassicClassRef = useRef<any>(null);
  const CreateEditViewCustomFitnessRef = useRef<any>(null);
  const createEditViewChannelRef = useRef<any>(null);
  const createEditViewCohortRef = useRef<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<any>("");
  const [currentIndex, setCurrentIndex] = useState<any>("");
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const [triggeredDetails, setTriggeredDetails] = useState<any>({});

  function handleModalRender(
    id: string | null,
    actionType: string,
    type: string,
    current_status?: boolean
  ) {
    switch (type) {
      case "One-On-One":
        createEditViewPersonalTrainingRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status,
        });
        break;
      case "On-Demand PT":
        CreateEditViewOnDemandPtRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status,
        });
        break;
      case "Group Class":
        CreateEditViewGroupClassRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status,
        });
        break;
      case "Classic Class":
        CreateEditViewClassicClassRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status,
        });
        break;
      case "Custom Fitness":
        CreateEditViewCustomFitnessRef.current.TriggerForm({
          id: id,
          type: actionType,
          actionType: type,
          current_status: current_status,
        });
        break;
      case "Live Stream Channel":
        createEditViewChannelRef.current.TriggerForm({
          id: id,
          type: actionType,
          packageType: type,
          current_status: current_status,
        });
        break;
      case "Cohort":
        createEditViewCohortRef.current.TriggerForm({
          id: id,
          type: actionType,
          packageType: type,
          current_status: current_status,
        });
        break;
    }
  }

  const columns = useMemo<any>(
    () => [
      { accessor: "packagename", Header: "Package Name" },
      {
        accessor: "Preview",
        Header: "Preview",
        Cell: ({ row }: any) => {
          return (
            <>
              <DrawerTrigger
                toggle={() => {
                  setShowDrawer(!showDrawer);
                  setTriggeredDetails({
                    type: row.original.type,
                    name: row.original.packagename,
                    level: row.original.level,
                    thumbnailId: row.original.thumbnailId,
                    pricing: row.original.pricing,
                    address: row.original.address,
                    ptonline: row.original.ptonline,
                    ptoffline: row.original.ptoffline,
                    grouponline: row.original.grouponline,
                    groupoffline: row.original.groupoffline,
                    recordedclasses: row.original.recordedclasses
                  });
                }}
              />
            </>
          );
        },
      },
      {
        accessor: "type",
        Header: "Type",
        Cell: ({ row }: any) => {
          return (
            <div>
              {row.original.type === "Group Class" ? (
                <div>
                  <img src="./assets/GroupType.svg" alt="GroupType" />
                </div>
              ) : (
                ""
              )}
              {row.original.type === "On-Demand PT" ? (
                <div>
                  <img src="./assets/PTType.svg" alt="on demand pt" />
                </div>
              ) : (
                ""
              )}
              {row.original.type === "One-On-One" ? (
                <div>
                  <img src="./assets/PTType.svg" alt="PTType" />
                </div>
              ) : (
                ""
              )}
              {row.original.type === "Classic Class" ? (
                <div>
                  <img src="./assets/ClassicType.svg" alt="ClassicType" />
                </div>
              ) : (
                ""
              )}
              {row.original.type === "Custom Fitness" ? (
                <div>
                  <img src="./assets/CustomType.svg" alt="CustomType" />
                </div>
              ) : (
                ""
              )}
              {row.original.type === "Cohort" ? (
                <div>
                  <img src="./assets/cohort.svg" alt="CohortType" />
                </div>
              ) : (
                ""
              )}
              {row.original.type === "Live Stream Channel" ? (
                <div>
                  <img src="./assets/livestream.svg" alt="live stream" />
                </div>
              ) : (
                ""
              )}
            </div>
          );
        },
      },
      {
        accessor: "details",
        Header: "Details",
        Cell: ({ row }: any) => {
          return (
            <div className="d-flex justify-content-center align-items-center">
              {row.values.details[0] && row.values.details[0] ? (
                <div className="text-center">
                  <OfferingsDisaplyImage
                    mode={
                      row.original?.mode === "Hybrid"
                        ? "Online"
                        : row.original?.mode
                    }
                    packageType={row.original?.type}
                  />
                  <p>{row.original.details[0] * currentIndex[row.index]}</p>
                </div>
              ) : (
                ""
              )}
              {row.values.details[1] && row.values.details[1] ? (
                <div className="text-center">
                  <OfferingsDisaplyImage
                    mode={
                      row.original?.mode === "Hybrid"
                        ? "Offline"
                        : row.original?.mode
                    }
                    packageType={
                      row.original?.type === "Custom Fitness"
                        ? "One-On-One"
                        : row.original?.type
                    }
                  />
                  <p>{row.values.details[1] * currentIndex[row.index]}</p>
                </div>
              ) : (
                ""
              )}
              {row.values.details[2] !== null && row.values.details[2] !== 0 ? (
                <div className="text-center">
                  <OfferingsDisaplyImage
                    mode={
                      row.original?.mode === "Hybrid"
                        ? "Online"
                        : row.original?.mode
                    }
                    packageType={row.original?.type}
                  />

                  <p>
                    {row.original?.freeClass
                      ? row.original.pricing[selectedDuration[row.index]]
                          ?.classes
                      : row.values.details[2] * currentIndex[row.index]}
                  </p>
                </div>
              ) : (
                ""
              )}
              {row.values.details[3] !== null && row.values.details[3] !== 0 ? (
                <div className="text-center">
                  <OfferingsDisaplyImage
                    mode={
                      row.original?.mode === "Hybrid"
                        ? "Offline"
                        : row.original?.mode
                    }
                    packageType={
                      row.original?.type === "Custom Fitness"
                        ? "Group Class"
                        : row.original?.type
                    }
                  />

                  <p>
                    {row.original?.freeClass
                      ? row.original.pricing[selectedDuration[row.index]]
                          ?.classes
                      : row.values.details[3] * currentIndex[row.index]}
                  </p>
                </div>
              ) : (
                ""
              )}
              {row.values.details[4] !== null && row.values.details[4] !== 0 ? (
                <div className="text-center">
                  <OfferingsDisaplyImage
                    mode={
                      row.original?.type === "Custom Fitness"
                        ? "Online"
                        : row.original?.mode
                    }
                    packageType={
                      row.original?.type === "Custom Fitness"
                        ? "Classic Class"
                        : row.original?.type
                    }
                  />

                  <p>{row.values.details[4] * currentIndex[row.index]}</p>
                </div>
              ) : (
                ""
              )}
              {row.values.details[5] !== null &&
              row.values.details[4] === null &&
              row.original?.type === "Group Class" ? (
                <div className="text-center">
                  {row.values.details[6] === "Online" ? (
                    <OfferingsDisaplyImage
                      mode={"Online"}
                      packageType={row.original?.type}
                    />
                  ) : (
                    <OfferingsDisaplyImage
                      mode={"Offline"}
                      packageType={row.original?.type}
                    />
                  )}

                  <p>{row.values.details[5] * currentIndex[row.index]}</p>
                </div>
              ) : (
                ""
              )}
            </div>
          );
        },
      },
      {
        accessor: "duration",
        Header: "Duration",
        Cell: ({ row }: any) => {
          return (
            <>
              <Form.Group>
                <Form.Control
                  id={row.index}
                  value={selectedDuration[row.index]}
                  as="select"
                  onChange={(e) => {
                    const updateSelectedDuration = [...selectedDuration];
                    const updateCurrentindex = [...currentIndex];

                    let value = 1;
                    if (e.target.value === "1") {
                      value *= 3;
                    } else if (e.target.value === "2") {
                      value *= 6;
                    } else if (e.target.value === "3") {
                      value *= 12;
                    }
                    updateSelectedDuration[row.index] = Number(e.target.value);
                    updateCurrentindex[row.index] = value;
                    setSelectedDuration(updateSelectedDuration);
                    setCurrentIndex(updateCurrentindex);
                  }}
                >
                  {row.values.duration.map((item: number, index: number) => {
                    return (
                      <option key={index} value={index}>
                        {item !== 0 && item} days
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
            </>
          );
        },
      },
      {
        accessor: "mrp",
        Header: "MRP",
        Cell: ({ row }: any) => {
          const pricing = row.values.mrp[selectedDuration[row.index]];
          return (
            <>
              <p
                className={`text-capitalize ${
                  pricing === "free" ? "text-success font-weight-bold" : ""
                }`}
              >
                {pricing === "free" ? "" : "\u20B9"} {pricing}
              </p>
            </>
          );
        },
      },

      {
        accessor: "sessions",
        Header: "Session",
        Cell: (v: any) => {
          let sessionsObj = {};
          let startMoment = moment(v.row.original.startDate);
          let endMoment = moment(v.row.original.endDate).add(1, "days");

          v.row.original.sessions.map((curr) => {
            return curr.sessions.map((item) => {
              sessionsObj[item.session_date] =
                (sessionsObj[item.session_date] || 0) + 1;

              return sessionsObj;
            });
          });

          let lengthOfobject = Object.keys(sessionsObj).length;

          let differenceBetweenStartDateandEndDate = endMoment.diff(
            startMoment,
            "days"
          );

          return v.row.original.type === "Group Class" ||
            v.row.original.type === "Live Stream Channel" ? (
            Object.keys(sessionsObj).length === 3 ? (
              <Badge
                className="px-3 py-1"
                style={{ fontSize: "1rem", borderRadius: "10px" }}
                variant={"success"}
              >
                {"Published"}
              </Badge>
            ) : (
              <>
                <ProgressBar variant="success" now={lengthOfobject} />
                {lengthOfobject}/3 program build
              </>
            )
          ) : v.row.original.type !== "One-On-One" &&
            v.row.original.type !== "Custom Fitness" &&
            v.row.original.type !== "On-Demand PT" ? (
            <div>
              {(v.row.original.type === "Classic Class"
                ? v.row.original.duration[0]
                : differenceBetweenStartDateandEndDate) ===
              Object.keys(sessionsObj).length ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant={"success"}
                >
                  {"Published"}
                </Badge>
              ) : (
                <>
                  <ProgressBar variant="success" now={lengthOfobject} />
                  {lengthOfobject}/
                  {v.row.original.type === "Classic Class"
                    ? v.row.original.duration[0]
                    : differenceBetweenStartDateandEndDate}{" "}
                  program build
                </>
              )}{" "}
            </div>
          ) : (
            <div>
              {v.row.original.status ? (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant={"success"}
                >
                  {"Published"}
                </Badge>
              ) : (
                <Badge
                  className="px-3 py-1"
                  style={{ fontSize: "1rem", borderRadius: "10px" }}
                  variant={"danger"}
                >
                  {"Draft"}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        id: "edit",
        Header: "Actions",
        Cell: ({ row }: any) => {
          const editHandler = () => {
            handleModalRender(row.original.id, "edit", row.original.type);
          };

          const statusChangeHandler = () => {
            handleModalRender(
              row.original.id,
              "toggle-status",
              row.original.type,
              row.original.status
            );
          };

          const viewHandler = () => {
            handleModalRender(row.original.id, "view", row.original.type);
          };

          const deleteHandler = () => {
            handleModalRender(row.original.id, "delete", row.original.type);
          };

          const manageHandler = (id: number, length: number, type: string) => {
            let name: string = "";
            if (type === "Classic Class") {
              name = "classic";
            } else if (type === "Live Stream Channel") {
              name = "channel";
            } else if (type === "Cohort") {
              name = "cohort";
            } else if (type === "Group Class") {
              name = "group";
            }
            if (length > 1) {
              window.open(`${name}/session/scheduler/${id}`, "_self");
            } else {
              window.open(`${name}/session/scheduler/${id}`, "_self");
            }
          };

          let arrayAction = [
            { actionName: "Edit", actionClick: editHandler },
            { actionName: "View", actionClick: viewHandler },
            { actionName: "Delete", actionClick: deleteHandler },
          ];

          if (
            row.original.tagId.length >= 1 &&
            row.original.type !== "One-On-One" &&
            row.original.type !== "Custom Fitness" &&
            row.original.type !== "On-Demand PT"
          ) {
            for (let i = 0; i < row.original.tagId.length; i++) {
              arrayAction.push({
                actionName: `Manage ${
                  row.original.tagId.length === 1 ? "" : row.original.tagname[i]
                }`,
                actionClick: () =>
                  manageHandler(
                    row.original.tagId[i],
                    row.original.tagId.length,
                    row.original.type
                  ),
              });
            }
          } else if (
            row.original.type === "One-On-One" ||
            row.original.type === "Custom Fitness" ||
            row.original.type === "On-Demand PT"
          ) {
            arrayAction.push({
              actionName: "Status Change",
              actionClick: statusChangeHandler,
            });
          }

          return <ActionButton arrayAction={arrayAction}></ActionButton>;
        },
      },
    ],
    // eslint-disable-next-line
    [selectedDuration, currentIndex]
  );

  const [dataTable, setDataTable] = useState<any>([]);

  // eslint-disable-next-line
  const [tags, { data: get_tags, refetch: refetch_tags }] = useLazyQuery(
    GET_TAGS,
    {
      variables: { id: auth.userid },
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        const tagsFlattenData = flattenObj({ ...data });
        const fitnessFlattenData = flattenObj({ ...get_fitness });
        
        setDataTable(
          [...fitnessFlattenData?.fitnesspackages].map((item) => {
            return {
              sessions: tagsFlattenData.tags.filter(
                (currentValue) => currentValue.fitnesspackage.id === item.id
              ),
              tagId: tagsFlattenData.tags
                .filter(
                  (currentValue) => currentValue.fitnesspackage.id === item.id
                )
                .map((currentValue) => [currentValue.id]),
              tagname: tagsFlattenData.tags
                .filter(
                  (currentValue) => currentValue.fitnesspackage.id === item.id
                )
                .map((currentValue) => [currentValue.tag_name]),
              thumbnailId: item.Thumbnail_ID,
              level: item.level,
              id: item.id,
              address: item.address,
              packagename: item.packagename,
              firstName: item.users_permissions_user.First_Name,
              lastName: item.users_permissions_user.Last_Name,
              ptonline: item.ptonline,
              ptoffline: item.ptoffline,
              grouponline: item.grouponline,
              groupoffline: item.groupoffline,
              recordedclasses: item.recordedclasses,
              status: item.Status,
              type: item.fitness_package_type.type,
              details: [
                item.ptonline,
                item.ptoffline,
                item.grouponline,
                item.groupoffline,
                item.recordedclasses,
                item.duration,
                item.mode,
              ],
              duration: item.fitnesspackagepricing.map((i) => i.duration),
              mrp: item.fitnesspackagepricing.map((i) => i.mrp),
              Status: item.Status ? "Active" : "Inactive",
              publishingDate: item.publishing_date,
              mode: item.mode,
              days: item.duration,
              pricing: item.fitnesspackagepricing,
              freeClass: item.groupinstantbooking,
              startDate: item.Start_date,
              endDate: item.End_date,
            };
          })
        );

        setSelectedDuration(
          new Array(fitnessFlattenData.fitnesspackages.length).fill(0)
        );
        setCurrentIndex(
          new Array(fitnessFlattenData.fitnesspackages.length).fill(1)
        );
      },
    }
  );

  const { data: get_fitness, refetch: refetchFitness } = useQuery(GET_FITNESS, {
    variables: { id: auth.userid },
    onCompleted: (data) => {
      tags({ variables: { id: auth.userid } });
    },
  });

  return (
    <>
      <Drawer
        show={showDrawer}
        close={() => setShowDrawer(false)}
        details={triggeredDetails}
      />

      {showDrawer ? <Backdrop close={() => setShowDrawer(false)} /> : null}
      <TabContent>
        <div className="justify-content-lg-center d-flex overflow-auto p-3">
          <DropdownButton
            className="mx-3"
            variant="outline-secondary"
            id="dropdown-basic-button"
            title={
              <span>
                <i className="fas fa-plus-circle"></i> One-On-One
              </span>
            }
          >
            <Dropdown.Item
              onClick={() => {
                handleModalRender(null, "create", "One-On-One");
              }}
            >
              Package subscription
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                handleModalRender(null, "create", "On-Demand PT");
              }}
            >
              On-Demand
            </Dropdown.Item>
          </DropdownButton>
          <Button
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
            className="mx-3"
            variant={true ? "outline-secondary" : "light"}
            size="sm"
            onClick={() => {
              handleModalRender(null, "create", "Group Class");
            }}
          >
            <i className="fas fa-plus-circle"></i> Group
          </Button>
          <Button
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
            className="mx-3"
            variant={true ? "outline-secondary" : "light"}
            size="sm"
            onClick={() => {
              handleModalRender(null, "create", "Classic Class");
            }}
          >
            <i className="fas fa-plus-circle"></i> Recorded
          </Button>
          <Button
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
            className="mx-3"
            variant={true ? "outline-secondary" : "light"}
            size="sm"
            onClick={() => {
              handleModalRender(null, "create", "Custom Fitness");
            }}
          >
            <i className="fas fa-plus-circle"></i> Custom
          </Button>
          <Button
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
            className="mx-3"
            variant={true ? "outline-secondary" : "light"}
            size="sm"
            onClick={() => {
              handleModalRender(null, "create", "Live Stream Channel");
            }}
          >
            <i className="fas fa-plus-circle"></i> Live Stream
          </Button>
          <Button
            style={{ whiteSpace: "nowrap", textAlign: "center" }}
            className="mx-3"
            variant={true ? "outline-secondary" : "light"}
            size="sm"
            onClick={() => {
              handleModalRender(null, "create", "Cohort");
            }}
          >
            <i className="fas fa-plus-circle"></i> Cohort
          </Button>
        </div>
        <Container>
          <Row>
            <Col>
              <Card.Title className="text-center">
                <CreateEditViewChannel
                  ref={createEditViewChannelRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                ></CreateEditViewChannel>
                <CreateEditViewCohort
                  ref={createEditViewCohortRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                ></CreateEditViewCohort>
                <CreateEditViewPersonalTraining
                  ref={createEditViewPersonalTrainingRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewOnDemandPt
                  ref={CreateEditViewOnDemandPtRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewGroupClass
                  ref={CreateEditViewGroupClassRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewClassicClass
                  ref={CreateEditViewClassicClassRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
                <CreateEditViewCustomFitness
                  ref={CreateEditViewCustomFitnessRef}
                  refetchTags={refetch_tags}
                  refetchOfferings={refetchFitness}
                />
              </Card.Title>
            </Col>
          </Row>
        </Container>
        <Table columns={columns} data={dataTable} />
      </TabContent>
    </>
  );
}

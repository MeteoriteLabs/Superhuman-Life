import React from "react";
import "./style.css";
import { Row, Col, Card } from "react-bootstrap";
import DisplayImage from "../DisplayImage";
import Icons from "../Icons";

const Drawer: React.FC<{
  show: boolean;
  close: any;
  details: any;
}> = (props) => {
  console.log(props);

  return (
    <>
      {props ? (
        <div
          className={
            props.show
              ? "side-drawer open col-lg-7 col-sm-8"
              : "side-drawer col-lg-7 col-sm-8"
          }
        >
          <Row>
            <Col lg={1}>
              <Icons
                name={"close"}
                onClick={props.close}
                style={{ cursor: "pointer" }}
              />
            </Col>

            <Col lg={11}>
              <div
                style={{
                  background: "no-repeat url(assets/phonescreen.svg)",
                  backgroundAttachment: "scroll",
                  backgroundSize: "100% 100%",
                }}
              >
                <div style={{ height: "100vh", width: "40vh" }}>
                  {props.details.type !== "Cohort" ||
                    props.details.type !== "Classic Class"}
                  <Card
                    className="rounded ml-5 mt-5 d-flex"
                    style={{
                      width: "30%",
                      position: "absolute",
                      top: "15%",
                      left: "33%",
                    }}
                  >
                    <Row>
                      <Col lg={12}>
                        <DisplayImage
                          imageName={
                            props.details.thumbnailId
                              ? props.details.thumbnailId
                              : ""
                          }
                          defaultImageUrl="assets/placeholder.svg"
                          imageCSS="rounded-lg w-100 img-fluid img-thumbnail"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={5} className="ml-1">
                        <p style={{ fontSize: "0.7rem" }}>
                          {props.details.name}
                        </p>
                        <p
                          style={{ fontSize: "0.7rem" }}
                          className="bg-secondary text-white rounded-pill text-center"
                        >
                          {props.details.level}
                        </p>
                      </Col>
                      <Col lg={5} className="ml-1 d-flex">
                        {props.details.address ? (
                          <>
                            <img
                              src="assets/location.svg"
                              alt="location"
                              style={{ height: "1.5rem" }}
                            />
                            <p style={{ fontSize: "0.7rem" }}>
                              {props.details.address}
                            </p>
                          </>
                        ) : null}
                      </Col>
                    </Row>
                    {props.details?.type === "Classic Class" ? null : <hr />}
                    <Row>
                      <Col lg={6} className="ml-1 d-flex">
                        <Row>
                          <Col lg={12}>
                            {
                              props.details?.type === "Group Class" ? 
                              <>
                              <img
                              loading="lazy"
                              src={"assets/Group-Offline.svg"}
                              alt="group-offline"
                              height={25}
                            />
                            +
                            <img
                              loading="lazy"
                              src="assets/Group-Online.svg"
                              height={25}
                              alt="group-online"
                            /> </>: null
                            }
                            {
                              props.details?.type === "One-On-One" ? 
                              <>
                              <>
                               <img
                              loading="lazy"
                              src={"assets/personal-training-offline.svg"}
                              alt="pt-offline"
                              height={25}
                            /><br/><p>{props.details.ptoffline}</p></>
                            +{" "}
                            <>
                            <img
                              loading="lazy"
                              src="assets/personal-training-online.svg"
                              height={25}
                              alt="ptonline"
                            /><br/><p>{props.details.ptonline}</p></>
                              </>
                              : null
                            }
                           
                          </Col>
                          <Col lg={12}>
                            <span style={{ fontSize: "0.7rem" }}>
                            {
                              props.details?.type === "One-On-One" ? 
                              <>
                              {props.details.ptoffline} 
                              + " "+
                              {props.details.ptonline}
                              </> : null}
                              {/* {
                              props.details?.type === "Group Class" ? 
                              <>
                              {`${props.details.groupoffline} ${props.details.grouponline}`}
                              </> : null} */}
                            </span>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={4} className="ml-1">
                        <p style={{ fontSize: "0.7rem" }}>
                          Rs.{" "}
                          {(props.details?.type === "On-Demand PT" ||
                            props.details?.type === "Classic Class" ||
                            props.details?.type === "Cohort") &&
                          props.details?.pricing &&
                          props.details?.pricing.length
                            ? props.details.pricing.find(
                                (curr) => curr.duration === 1
                              ).mrp
                            : null}
                          {(props.details?.type === "One-On-One" ||
                            props.details?.type === "Custom Fitness" ||
                            props.details?.type === "Group Class" ||
                            props.details?.type === "Live Stream Channel") &&
                          props.details?.pricing &&
                          props.details?.pricing.length
                            ? props.details.pricing.find(
                                (curr) => curr.duration === 30
                              ).mrp
                            : null}
                        </p>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      ) : null}
    </>
  );
};

export default Drawer;

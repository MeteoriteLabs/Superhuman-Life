import { Carousel, Card, Row, Col } from "react-bootstrap";
import DisplayImage from "../../../../components/DisplayImage/index";
import "../fitness.css";

const PreviewCohort = (props) => {
  const formData = props?.formContext;
  const classMode = JSON.parse(formData?.programDetails).mode;
  var pricing;
  if (typeof formData.pricing === "string") {
    pricing =
      formData?.pricing === "free"
        ? "free"
        : JSON.parse(formData?.pricing).filter((item) => item.mrp !== null);
  } else {
    pricing = [...props?.formContext?.pricing];
  }

  enum ENUM_FITNESSPACKAGE_LEVEL {
    Beginner,
    Intermediate,
    Advanced,
  }

  function handleCardRender() {
    if (pricing === "free") {
      return (
        <Carousel.Item key={1}>
          <Card
            className="text-center mx-auto"
            style={{ borderRadius: "20px" }}
          >
            <Card.Body className="pr-0 py-0">
              <div
                className="d-flex justify-content-between"
                style={{ borderBottom: "1px dashed gray" }}
              >
                <Row>
                  <Col lg={4}>
                    <div className="pt-3">
                      <DisplayImage
                        imageName={
                          props?.formContext?.thumbnail
                            ? props?.formContext?.thumbnail
                            : null
                        }
                        defaultImageUrl="assets/placeholder.svg"
                        imageCSS="rounded-lg w-100 img-fluid img-thumbnail"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="text-left pt-4 d-flex flex-column justify-content-between">
                      <Card.Title>{props.formContext.packageName}</Card.Title>
                      <p>{props.formContext.About}</p>
                      <div>
                        <div className="d-flex justify-content-start align-items-center">
                          {JSON.parse(formData.discpline).map((item, index: number) => {
                            return (
                              <div
                                key={index}
                                className="mr-2 my-3"
                                style={{
                                  padding: "0.5rem 1rem",
                                  backgroundColor: "#F2E890",
                                  borderRadius: "20px",
                                }}
                              >
                                <p className="mb-0">{item.disciplinename}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="align-right">
                      <p
                        className={`py-2 px-4 text-white ${
                          ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level] ===
                          undefined
                            ? "All"
                            : ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level]
                        }-level`}
                        style={{
                          borderTopRightRadius: "20px",
                          borderBottomLeftRadius: "20px",
                        }}
                      >
                        {props.formContext?.level
                          ? ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level]
                          : "All Levels"}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="pt-3 d-flex justify-content-between align-items-center ">
                <div className="d-flex justify-content-center align-items-center">
                  <div>
                    <img
                      src={`/assets/customclassic.svg`}
                      alt="custom-classic"
                      title="Personal Training Online"
                    />
                    <p>{5}</p>
                  </div>
                  <div
                    className="px-4"
                    style={{ borderRight: "1px solid black" }}
                  ></div>
                </div>
                <div>
                  <p
                    className="mb-0 mr-3 text-capitalize"
                    style={{ color: "#72B54C", fontSize: "2rem" }}
                  >
                    free
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Carousel.Item>
      );
    } else {
      return pricing.map((item) => {
        return (
          <Carousel.Item key={1}>
            <Card
              className="text-center mx-auto"
              style={{ borderRadius: "20px"}}
            >
              <Card.Body className="pr-0 py-0">
                <div
                  className="d-flex justify-content-between"
                  style={{ borderBottom: "1px dashed gray" }}
                >
                  <Row>
                    <Col lg={4}>
                      <div className="pt-3">
                        <DisplayImage
                          imageName={
                            props?.formContext?.thumbnail
                              ? props?.formContext?.thumbnail
                              : null
                          }
                          defaultImageUrl="assets/placeholder.svg"
                          imageCSS="rounded-lg w-100 img-fluid img-thumbnail"
                        />
                      </div>
                    </Col>
                    <Col>
                      <div className="text-left pt-4 d-flex flex-column justify-content-between">
                        <Card.Title>{props.formContext.packageName}</Card.Title>
                        <p>{props.formContext.About}</p>
                        <div>
                          <div className="d-flex justify-content-start align-items-center">
                            {JSON.parse(formData.discpline).map(
                              (item, index: number) => {
                                return (
                                  <div
                                    key={index}
                                    className="mr-2 my-3"
                                    style={{
                                      padding: "0.5rem 1rem",
                                      backgroundColor: "#F2E890",
                                      borderRadius: "20px",
                                    }}
                                  >
                                    <p className="mb-0">
                                      {item.disciplinename}
                                    </p>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <div className="align-right">
                        <p
                          className={`py-2 px-4 text-white ${
                            ENUM_FITNESSPACKAGE_LEVEL[
                              props.formContext.level
                            ] === undefined
                              ? "All"
                              : ENUM_FITNESSPACKAGE_LEVEL[
                                  props.formContext.level
                                ]
                          }-level`}
                          style={{
                            borderTopRightRadius: "20px",
                            borderBottomLeftRadius: "20px",
                          }}
                        >
                          {props.formContext?.level
                            ? ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level]
                            : "All Levels"}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="pt-3 d-flex justify-content-between align-items-center ">
                  <div className="d-flex justify-content-center align-items-center">
                    {classMode === "0" && (
                      <div>
                        <img
                          src={`/assets/cohort_online.svg`}
                          alt="custom-classic"
                          title="Personal Training Online"
                        />
                        <p>{item.duration}</p>
                      </div>
                    )}
                    {(classMode === "1" || classMode === "2") && (
                      <div>
                        <img
                          src={`/assets/cohort_offline.svg`}
                          alt="custom-classic"
                          title="Personal Training Online"
                        />
                        <p>{item.duration}</p>
                      </div>
                    )}

                    <div className="ml-4">
                      <h4>Class Size</h4>
                      <p
                        className="mb-0"
                        style={{ color: "purple", fontSize: "1.3rem" }}
                      >
                        {props.formContext.classSize}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      className="mb-0 mr-3"
                      style={{ color: "#72B54C", fontSize: "2rem" }}
                    >
                      {"\u20B9"} {item.mrp}
                    </p>
                    <p>per {item.duration} days</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Carousel.Item>
        );
      });
    }
  }

  return (
    <>
      <Carousel
        prevIcon={
          <i
            className="fa fa-chevron-left fa-lg p-3"
            style={{
              borderRadius: "50%",
              color: "white",
              backgroundColor: "black",
            }}
          ></i>
        }
        nextIcon={
          <i
            className="fa fa-chevron-right fa-lg p-3"
            style={{
              borderRadius: "50%",
              color: "white",
              backgroundColor: "black",
            }}
          ></i>
        }
        controls={false}
      >
        {handleCardRender()}
      </Carousel>

      {/* <SocialMediaComponent url={URL} /> */}
    </>
  );
};

export default PreviewCohort;

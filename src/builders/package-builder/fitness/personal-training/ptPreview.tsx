import { Carousel, Card, Row, Col } from "react-bootstrap";
import DisplayImage from "../../../../components/DisplayImage/index";
import "../fitness.css";

const PreviewPt = (props) => {
  const formData = props?.formContext;
  const programDetails = JSON.parse(formData?.programDetails);
  let pricing;
  if (typeof formData.pricingDetail === "string") {
    pricing =
      formData?.pricingDetail === "free"
        ? "free"
        : JSON.parse(formData?.pricingDetail).filter(
            (item) => item.mrp !== null
          );
  } else {
    pricing = [...props?.formContext?.pricingDetail];
  }

  enum ENUM_FITNESSPACKAGE_LEVEL {
    Beginner,
    Intermediate,
    Advanced,
    No_Level,
  }

  enum ENUM_FITNESSPACKAGE_PTCLASSSIZE {
    Solo,
    Couple,
    Family,
  }

  function handleImageRender(mode: string, duration: number) {
    if (mode === "0") {
      return (
        <div>
          <img
            src={`/assets/offeringsImages/on-demand-pt-online.svg`}
            alt="personal-training"
            title="Personal Training Online"
          />
          <p>{programDetails.online * duration}</p>
        </div>
      );
    } else if (mode === "1") {
      return (
        <div>
          <img
            src={`/assets/offeringsImages/on-demand-pt-offline.svg`}
            alt="personal-training"
            title="Personal Training Online"
          />
          <p>{programDetails.offline * duration}</p>
        </div>
      );
    } else {
      return (
        <>
          <div>
            <img
              src={`/assets/offeringsImages/one-on-one-online.svg`}
              alt="personal-training"
              title="Personal Training Online"
            />
            <p>{programDetails.online * duration}</p>
          </div>
          <div>
            <img
              src={`/assets/offeringsImages/one-on-one-offline.svg`}
              alt="personal-training"
              title="Personal Training Offline"
            />
            <p>{programDetails.offline * duration}</p>
          </div>
        </>
      );
    }
  }

  function handleCardRender() {
    return pricing.map((item, index: number) => {
      return (
        <Carousel.Item key={index}>
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
                        defaultImageUrl="https://picsum.photos/200"
                        imageCSS="rounded-lg w-100 img-fluid img-thumbnail"
                      />
                    </div>
                  </Col>
                  <Col>
                    <div className="text-left pt-4 d-flex flex-column justify-content-between">
                      <Card.Title>{props.formContext.packagename}</Card.Title>
                      <p>{props.formContext.About}</p>
                      <div>
                        <div className="d-flex justify-content-start align-items-center">
                          {JSON.parse(formData.disciplines).map(
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
                                  <p className="mb-0">{item.disciplinename}</p>
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
                        {props.formContext?.level !== undefined
                          ? ENUM_FITNESSPACKAGE_LEVEL[props.formContext.level]
                          : "All Levels"}
                      </p>
                    </div>
                  </Col>
                </Row>
              </div>
              <div className="pt-3 d-flex justify-content-between align-items-center ">
                <div className="d-flex justify-content-center align-items-center">
                  {handleImageRender(
                    programDetails.mode,
                    parseInt(item.duration) / 30
                  )}

                  <div className="ml-4">
                    <h4>Class Size</h4>
                    <p
                      className="mb-0"
                      style={{ color: "purple", fontSize: "1.3rem" }}
                    >
                      {
                        ENUM_FITNESSPACKAGE_PTCLASSSIZE[
                          props.formContext.classSize
                        ]
                      }
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
      >
        {handleCardRender()}
      </Carousel>
    </>
  );
};

export default PreviewPt;

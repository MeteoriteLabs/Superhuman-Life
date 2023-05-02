import React, { useRef, useState, useEffect } from 'react';
import { withTheme } from '@rjsf/core';
import { Theme as Bootstrap4Theme } from '@rjsf/bootstrap-4';
import { Button, Carousel, Col, Container, Modal, ProgressBar, Row } from 'react-bootstrap';
// import SocialLogin from "./SocialLogin";
import ChangeMakerSelect from '../../components/customWidgets/changeMakerList';
import LanguageSelect from '../../components/customWidgets/languagesList';
// import OrganizationSelect from "../../components/customWidgets/organizationTypeList";
import TimeZoneSelect from '../../components/customWidgets/timeZoneSelect';
import { useMutation } from '@apollo/client';
import {
  CREATE_ADDRESS,
  CREATE_ORGANIZATION,
  CREATE_EDUCATION_DETAIL,
  UPDATE_USER,
  REGISTER_USER
} from './mutations';
// import LocationForm from './Location';
import EmailForm from './email';
import UserNameForm from './userName';
import PhoneNumberForm from './number';
import YearOfPassingForm from './yearOfPassing';
import AddressForm from './address';
import FacebookLogin from 'react-facebook-login';
import Toaster from '../../components/Toaster';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';
import './socialLogin.css';
import Geocode from 'react-geocode';

interface FormValue {
  email: string;
  fname: string;
}

const linkedinClientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
const redirectUriForLinkedin = process.env.REACT_APP_LINKEDIN_REDIRECT_URI;
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
const facebookPageUrl = process.env.REACT_APP_FACEBOOK_PAGE_URL;
const instagramPageUrl = process.env.REACT_APP_INSTAGRAM_PAGE_URL;
const linkedinPageUrl = process.env.REACT_APP_LINKEDIN_PAGE_URL;

const Register: React.FC = () => {
  const registerSchema = require('./register.json');
  // eslint-disable-next-line
  const Form: any = withTheme(Bootstrap4Theme);
  // eslint-disable-next-line
  const formRef = useRef<any>(null);
  // eslint-disable-next-line
  const carouselRef = useRef<any>();
  const [step, setStep] = useState<number>(1);
  const [formValues, setFormValues] = useState<FormValue>({} as FormValue);
  // eslint-disable-next-line
  const [userFormData, setUserFormData] = useState<any>([]);
  const [successScreen, setSuccessScreen] = useState<boolean>(false);
  const [longitude, setLongitude] = useState<string>('');
  const [latitude, setLatitude] = useState<string>('');

  Geocode.setApiKey('AIzaSyDDvAlVrvbBYMW08BBosDFM_x2inY-XQ-w');
  Geocode.setLanguage('en');

  const [login, setLogin] = useState<boolean>(false);
  const [data, setData] = useState({});

  const redirectToLinkedinPage = () => {
    window.open(linkedinPageUrl);
  };

  const redirectToInstagramPage = () => {
    window.open(instagramPageUrl);
  };

  const redirectToFacebookPage = () => {
    window.open(facebookPageUrl);
  };

  //Facebook
  const responseFacebook = (response) => {
    // Login failed
    if (response.status === 'unknown') {
      alert('Login failed!');
      setLogin(false);
      return <Toaster type="danger" msg="Login failed" handleCallback={() => false} />;
    }
    setData(response);
    // setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };
  // eslint-disable-next-line
  const logout = () => {
    setLogin(false);
    setData({});
    // setPicture("");
  };

  //linkedin
  const { linkedInLogin } = useLinkedIn({
    clientId: `${linkedinClientId}`,
    redirectUri: `${redirectUriForLinkedin}`,
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
    }
  });

  useEffect(() => {
    localStorage.setItem('dataKey', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const items = localStorage.getItem('dataKey');
    if (items) {
      const a = JSON.parse(items);
      setFormValues({ email: a.email, fname: a.name });
    }
  }, [data]);

  // eslint-disable-next-line
  const uiSchema: any = {
    email: {
      'ui:widget': (props) => {
        return <EmailForm {...props} />;
      }
    },
    userName: {
      'ui:widget': (props) => {
        return <UserNameForm {...props} />;
      }
    },
    password: {
      'ui:widget': 'password',
      'ui:help': 'Hint: Make it strong! minimum password length should be 8.'
    },
    confirm: {
      'ui:widget': 'password'
    },
    gender: {
      'ui:widget': 'radio',
      'ui:options': {
        inline: true
      }
    },
    changemaker: {
      specialist: {
        'ui:widget': (props) => {
          return <ChangeMakerSelect {...props} />;
        }
      }
    },
    language: {
      'ui:widget': (props) => {
        return <LanguageSelect {...props} />;
      }
    },
    education: {
      'ui:options': {
        orderable: false
      },
      items: {
        'ui:emptyValue': '',
        'ui:placeholder': 'e.g. Masters in Yoga Therapy',
        yearOfPassing: {
          'ui:widget': (props) => {
            return <YearOfPassingForm {...props} />;
          }
        }
      }
    },
    contact: {
      'ui:widget': (props) => {
        return <PhoneNumberForm {...props} />;
      }
    },
    address: {
      'ui:widget': (props) => {
        return <AddressForm {...props} />;
      }
    },
    specification: {
      'ui:placeholder': 'e.g. Yoga Trainer or General Physician'
    },
    aboutMe: {
      'ui:widget': 'textarea',
      'ui:options': {
        rows: 3
      }
    },
    multipleChoicesList: {
      'ui:widget': 'checkboxes'
    },
    // organization: {
    //   items: {
    //     Organization_Description: {
    //       "ui:widget": "textarea",
    //       "ui:options": {
    //         rows: 3,
    //       },
    //     },
    //     Organization_Type: {
    //       "ui:widget": (props) => {
    //         return <OrganizationSelect {...props} />;
    //       },
    //     },
    //   },
    // },
    timezone: {
      'ui:widget': (props) => {
        return <TimeZoneSelect {...props} />;
      }
    },
    // "location": {
    //     "ui:widget": (props) => {
    //         return <LocationForm {...props} />
    //     }
    // },
    challenge: {
      'ui:widget': 'textarea',
      'ui:placeholder': 'Try to explain the challenges you are facing (if any)',
      'ui:options': {
        rows: 3
      }
    },
    socialLogins: {
      'ui:widget': () => {
        return (
          <div>
            <label>Select any from below for autofill</label>
            <div>
              <div className=" py-2" style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  onClick={linkedInLogin}
                  src={linkedin}
                  alt="Sign in with Linked In"
                  style={{ height: '40px', width: '180px', cursor: 'pointer' }}
                />
              </div>

              <div className="py-2" style={{ display: 'flex', justifyContent: 'center' }}>
                {!login && (
                  <FacebookLogin
                    appId={`${facebookAppId}`}
                    autoLoad={false}
                    fields="name,email,picture"
                    scope="public_profile,email,user_friends"
                    callback={responseFacebook}
                    icon="fa-facebook"
                    cssClass="my-facebook-button-class"
                  />
                )}
              </div>

              <div className="w-100 py-2" style={{ display: 'flex', justifyContent: 'center' }}>
                <GoogleOAuthProvider clientId={`${googleClientId}`}>
                  <GoogleLogin
                    onSuccess={(credentialResponse) => {
                      console.log(credentialResponse);
                    }}
                    onError={() => {
                      <Toaster type="danger" msg="Login Failed" handleCallback={() => false} />;
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
            <br />
            <span>
              Have an account already?{' '}
              <a href="/login" style={{ color: 'red' }}>
                Sign In
              </a>
            </span>
          </div>
        );
      }
    }
  };

  const [newUserId, setNewUserId] = useState<string>('');

  const [registerUser] = useMutation(REGISTER_USER, {
    onCompleted: (data) => {
      setNewUserId(data.register.user.id);

      updateUser({
        variables: {
          userid: data.register.user.id,
          fname: userFormData.fname,
          lname: userFormData.lname,
          email: userFormData.email,
          password: userFormData.password,
          phone: userFormData.contact,
          uname: userFormData.userName,
          dob: userFormData.dob,
          gender: userFormData.gender,
          about: userFormData.aboutMe,
          module_permissions: userFormData.multipleChoicesList,
          // let id = e.map(d => {return d.id}).join(',');
          languages: JSON.parse(userFormData.language)
            .map((d) => {
              return d.id;
            })
            .join(', ')
            .split(', '),
          timezone: JSON.parse(userFormData.timezone)[0].id
        }
      });
    }
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      createAddress({
        variables: {
          address1: JSON.parse(userFormData.address).address1,
          address2: JSON.parse(userFormData.address).address2,
          city: JSON.parse(userFormData.address).city,
          state: JSON.parse(userFormData.address).state,
          zipcode: JSON.parse(userFormData.address).zip,
          country: JSON.parse(userFormData.address).country,
          Title: JSON.parse(userFormData.address).addressTitle,
          user: newUserId,
          longitude: longitude,
          latitude: latitude
        }
      });
    }
  });

  // eslint-disable-next-line
  const [createOrganization] = useMutation(CREATE_ORGANIZATION, {
    onCompleted: () => {
      createAddress({
        variables: {
          address1: userFormData.address1,
          address2: userFormData.address2,
          city: userFormData.city,
          state: userFormData.state,
          zipcode: userFormData.zip,
          country: userFormData.country,
          Title: userFormData.title,
          user: newUserId,
          longitude: longitude,
          latitude: latitude
        }
      });
    }
  });

  const [createAddress] = useMutation(CREATE_ADDRESS, {
    onCompleted: () => {
      for (
        let educationDetails = 0;
        educationDetails < userFormData.education.length;
        educationDetails++
      ) {
        createEducationDetail({
          variables: {
            Institute_Name: userFormData.education[educationDetails].instituteName,
            Type_of_degree: userFormData.education[educationDetails].typeOfDegree,
            Specialization: userFormData.education[educationDetails].specialization,
            year_of_passing: userFormData.education[educationDetails].yearOfPassing,
            user: newUserId
          }
        });
      }
    }
  });

  const [createEducationDetail] = useMutation(CREATE_EDUCATION_DETAIL, {
    onCompleted: () => {
      setSuccessScreen(true);
      localStorage.clear();
    }
  });

  // eslint-disable-next-line
  async function submitHandler(formData: any) {
    if (step < 4) {
      setStep(step + 1);
      carouselRef.current.next();
      setFormValues({ ...formValues, ...formData });
    } else {
      // setFormValues({ ...formValues, ...formData });
      const values = { ...formValues, ...formData };
      // JSON.parse(values.address)
      // JSON.parse(values.changemaker.specialist)
      // JSON.parse(values.language)
      // JSON.parse(values.organization[0]?.Organization_Type)
      // JSON.parse(values.timezone)

      await setUserFormData(values);

      registerUser({
        variables: {
          email: values.email,
          name: values.userName,
          password: values.password
        }
      });
    }
  }

  function Validate(formData, errors) {
    const ele = document.getElementsByClassName('invalidEmail');
    const ele2 = document.getElementsByClassName('invalidUname');
    const ele3 = document.getElementsByClassName('invalidNumber');
    if (formData.email) {
      if (ele.length !== 0) {
        errors.email.addError('Please enter a valid email address');
      }
    }
    if (formData.userName) {
      if (ele2.length !== 0) {
        errors.userName.addError('Please enter some other username');
      }
    }
    if (formData.contact) {
      if (ele3.length !== 0) {
        errors.contact.addError('Please enter a valid phone number');
      }
    }
    if (formData.password !== formData.confirm) {
      errors.confirm.addError("Passwords don't match");
    }
    return errors;
  }

  function getLocation() {
    if (!navigator.geolocation) {
      console.log('Geolocation API not supported by this browser.');
    } else {
      console.log('Checking location...');
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  function success(position) {
    setLatitude(position.coords.latitude.toString());
    setLongitude(position.coords.longitude.toString());
  }

  function error() {
    console.log('Geolocation error!');
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <>
      {successScreen && (
        <Modal.Dialog>
          <Modal.Body>
            <div>
              <Row style={{ justifyContent: 'center' }}>
                <h1>Congratulations!</h1>
              </Row>
              <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
                <h5>
                  <img height="32px" src="/assets/confirmed.svg" alt="confirmed"></img>
                  Confirmation Email Sent
                </h5>
              </Row>
              <blockquote className="blockquote text-right">
                <p className="text-danger blockquote-footer">Please Confirm your email address</p>
              </blockquote>
              <ul>
                <li>You will receive an email with the confirmation link.</li>
                <li>
                  Please click the link in your mail to confirm and then login into your account
                </li>
              </ul>
              <Row style={{ justifyContent: 'center', justifyItems: 'center' }}>
                <Button
                  onClick={() => (window.location.href = '/login')}
                  size="sm"
                  variant="danger">
                  Sign in
                </Button>
              </Row>
              <Row className="mt-5" style={{ justifyContent: 'center' }}>
                <h6>Follow us</h6>
              </Row>
              <Row style={{ justifyContent: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div>
                    <img
                      src="/assets/linkedin_signin.svg"
                      style={{ cursor: 'pointer' }}
                      height="70px"
                      className="d-block w-100"
                      alt="sapien-exercise"
                      onClick={() => redirectToLinkedinPage}
                    />
                  </div>
                  <div>
                    <img
                      src="/assets/insta_signin.svg"
                      style={{ cursor: 'pointer' }}
                      height="70px"
                      className="d-block w-100"
                      alt="sapien-exercise"
                      onClick={() => redirectToInstagramPage()}
                    />
                  </div>
                  <div>
                    <img
                      src="/assets/facebook_signin.svg"
                      style={{ cursor: 'pointer' }}
                      height="70px"
                      className="d-block w-100"
                      alt="sapien-exercise"
                      onClick={() => redirectToFacebookPage()}
                    />
                  </div>
                </div>
              </Row>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      )}
      {!successScreen && (
        <Row noGutters>
          <Col>
            <Container>
              <Row>
                <Col xs={3} md={3} lg={3}>
                  <ProgressBar max={1} now={step - 1} style={{ height: '5px' }} variant="danger" />
                  <small className="text-muted">Step 1</small>
                </Col>
                <Col xs={3} md={3} lg={3}>
                  <ProgressBar max={1} now={step - 2} style={{ height: '5px' }} variant="danger" />
                  <small className="text-muted">Step 2</small>
                </Col>
                <Col xs={3} md={3} lg={3}>
                  <ProgressBar max={1} now={step - 3} style={{ height: '5px' }} variant="danger" />
                  <small className="text-muted">Step 3</small>
                </Col>
                <Col xs={3} md={3} lg={3}>
                  <ProgressBar max={1} now={step - 4} style={{ height: '5px' }} variant="danger" />
                  <small className="text-muted">Step 4</small>
                </Col>
              </Row>
              <Modal.Dialog scrollable>
                <Modal.Body className="bg-light">
                  <Form
                    uiSchema={uiSchema}
                    schema={registerSchema[step]}
                    ref={formRef}
                    showErrorList={false}
                    validate={Validate}
                    // eslint-disable-next-line
                    onSubmit={({ formData }: any) => submitHandler(formData)}
                    formData={formValues}
                    // onChange={HandleChange}
                  >
                    <div></div>
                  </Form>
                </Modal.Body>
                <Modal.Footer className="bg-light">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() => {
                      setStep(step - 1);
                      carouselRef.current.prev();
                    }}
                    disabled={step === 1 ? true : false}>
                    <i className="mr-2 fas fa-arrow-left"></i>
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={(event) => formRef.current.onSubmit(event)}>
                    {step < 4 ? (
                      <>
                        Next<i className="ml-4 fas fa-arrow-right"></i>
                      </>
                    ) : (
                      <>
                        Complete<i className="ml-4 fas fa-check"></i>
                      </>
                    )}
                  </Button>
                </Modal.Footer>
              </Modal.Dialog>
            </Container>
          </Col>
          <Col className="d-none d-lg-block">
            <Carousel
              ref={carouselRef}
              interval={8000}
              indicators={false}
              fade={true}
              controls={false}>
              <Carousel.Item>
                <img
                  src="/assets/step-1.svg"
                  height="700px"
                  className="d-block w-100"
                  alt="sapien-exercise"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  src="/assets/step-2.svg"
                  height="700px"
                  className="d-block w-100"
                  alt="sapien-exercise"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  src="/assets/step-3.svg"
                  height="700px"
                  className="d-block w-100"
                  alt="sapien-exercise"
                />
              </Carousel.Item>
              <Carousel.Item>
                <img
                  src="/assets/step-4.svg"
                  height="700px"
                  className="d-block w-100"
                  alt="sapien-exercise"
                />
              </Carousel.Item>
            </Carousel>
          </Col>
        </Row>
      )}
    </>
  );
};

export default Register;

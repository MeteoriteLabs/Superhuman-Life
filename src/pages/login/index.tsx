import { useContext } from "react";
import Form from "@rjsf/bootstrap-4";
import { Link } from "react-router-dom";
import { Button, Modal, Row, Col } from "react-bootstrap";
import authContext from "../../context/auth-context";
import { useMutation, gql } from '@apollo/client';

export default function Login() {
  const auth = useContext(authContext);
  const loginSchema: any = require("./login.json");
  const uiSchema: any = {
    "password": {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!",
      classNames: "test"
    }
  }

  const LOGIN = gql`
  mutation UserAuth($identifier: String!, $password: String!) {
    login(input: {
      identifier: $identifier,
      password: $password,
      provider: "local"
    }){
      jwt
      user{
        username
        email
        id
      }
    }
  }
`;

  const [login, { error }] = useMutation(LOGIN, { onCompleted: loginSuccess });
  
  function onSubmit(formData: any) {
    login(
      {
        variables: {
          identifier: formData.email, password: formData.password
        }
      }
    );
  }

  function loginSuccess(d: any) {
    auth.login(d.login.jwt, d.login.user.username,d.login.user.id);
  }

  return (
    <Modal.Dialog>
      {/* <Helmet>
        <meta charSet="utf-8" />
        <title>Sapien Dashboard | Login</title>
        <link rel="canonical" href="https://sapien.systems/" />
      </Helmet> */}
      <Modal.Body>
        <h4>Welcome Back!</h4>
        <p className="text-danger blockquote-footer">Sign In Using</p>
        <hr />
        <Form uiSchema={uiSchema} schema={loginSchema} onSubmit={({ formData }) => onSubmit(formData)}>
          { error &&
            <p className="text-danger">Incorrect email or password</p>
          }
          <Row className="mb-4 pr-3" style={{ justifyContent: 'end'}}>
            <Link style={{ color: 'red'}} className="float-right" to="/forgot-password">
              Forgot Password?
            </Link>
          </Row>
          <Row>
            <Col lg={5}>
              <Button type="submit" size="sm" variant="danger">
                Sign In<i className="ml-4 fas fa-arrow-right"></i>
              </Button>
            </Col>
            <Col>
              <Link className="float-right" to="/register">
                Don't have an account? Sign Up
              </Link>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal.Dialog>
  );
}
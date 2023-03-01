import { useState } from "react";
import FacebookLogin from "react-facebook-login";
import Toaster from "../../components/Toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { InstagramLogin } from "@amraneze/react-instagram-login";

const SocialLogin = (props: any) => {
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState("");

  const responseFacebook = (response) => {
    console.log(response);
    // Login failed
    if (response.status === "unknown") {
      alert("Login failed!");
      setLogin(false);
      return <Toaster type="danger" msg="Login failed" />;
    }
    setData(response);
    setPicture(response.picture.data.url);
    if (response.accessToken) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  };
  const logout = () => {
    setLogin(false);
    setData({});
    setPicture("");
  };

  //linkedin
  const { linkedInLogin } = useLinkedIn({
    clientId: "863m1h8lmozyrr",
    redirectUri: `${window.location.origin}/linkedin`,
    onSuccess: (code) => {
      console.log(code);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  //instagram
  const responseInstagram = (response) => {
    console.log(response);
  };

  return (
    <div>
      <label>Or</label>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div>
          <img
            onClick={linkedInLogin}
            src={linkedin}
            alt="Sign in with Linked In"
            style={{ maxWidth: "180px", cursor: "pointer" }}
          />
          {/* <img
            src="/assets/linkedin_signin.svg"
            style={{ cursor: "pointer" }}
            height="70px"
            className="d-block w-100"
            alt="sapien-exercise"
            onClick={() => console.log("linkedin")}
          /> */}
        </div>
        <div>
          <InstagramLogin
            clientId="579933617392054"
            buttonText="Login"
            onSuccess={responseInstagram}
            onFailure={responseInstagram}
          />
          {/* <img
            src="/assets/insta_signin.svg"
            style={{ cursor: "pointer" }}
            height="70px"
            className="d-block w-100"
            alt="sapien-exercise"
            onClick={() => console.log("instagram")}
          /> */}
        </div>

        {!login && (
          <FacebookLogin
            appId="1189245355056803"
            autoLoad={false}
            fields="name,email,picture"
            scope="public_profile,email,user_friends"
            callback={responseFacebook}
            icon="fa-facebook"
          />
        )}

        <div>
          <GoogleOAuthProvider clientId="914717417975-huef6bdt4iu0if5nigu7n87sa9eu50hg.apps.googleusercontent.com">
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </GoogleOAuthProvider>
          {/* <img
            src="/assets/google_signin.svg"
            style={{ cursor: "pointer" }}
            height="70px"
            className="d-block w-100"
            alt="sapien-exercise"
            onClick={() =>
              (window.location.href = "http://localhost:3000/connect/")
            }
          /> */}
        </div>
      </div>
      <br />
      <span>
        Have an account already?{" "}
        <a href="/login" style={{ color: "red" }}>
          Sign In
        </a>
      </span>
    </div>
  );
};

export default SocialLogin;

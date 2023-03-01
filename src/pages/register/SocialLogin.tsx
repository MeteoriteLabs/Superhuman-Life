import { useState } from "react";
import FacebookLogin from "react-facebook-login";
import Toaster from "../../components/Toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import linkedin from "react-linkedin-login-oauth2/assets/linkedin.png";
import { InstagramLogin } from "@amraneze/react-instagram-login";
import { useGoogleLogin } from "@react-oauth/google";
import "./socialLogin.css";

const linkedinClientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
const redirectUriForLinkedin = process.env.REACT_APP_LINKEDIN_REDIRECT_URI;
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const instagramClientId = process.env.REACT_APP_INSTAGRAM_CLIENT_ID;
const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

const SocialLogin = (props: any) => {
  const [login, setLogin] = useState(false);
  const [data, setData] = useState({});
  const [picture, setPicture] = useState("");

  //Facebook
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
    clientId: `${linkedinClientId}`,
    redirectUri: `${redirectUriForLinkedin}`,
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
      <div>
        <div
          className=" py-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <img
            onClick={linkedInLogin}
            src={linkedin}
            alt="Sign in with Linked In"
            style={{ height: "50px", width: "200px", cursor: "pointer" }}
          />
        </div>
        <div
          className="py-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <InstagramLogin
            clientId={`${instagramClientId}`}
            buttonText="Login"
            onSuccess={responseInstagram}
            onFailure={responseInstagram}
            style={{ height: "50px", cursor: "pointer", width: "200px" }}
          />
        </div>

        <div
          className="py-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {!login && (
            <FacebookLogin
              appId={`${facebookAppId}`}
              autoLoad={false}
              fields="name,email,picture"
              scope="public_profile,email,user_friends"
              callback={responseFacebook}
              icon="fa-facebook"
              cssClass="my-facebook-button-class"
              style={{
                height: "10px",
                cursor: "pointer",
                width: "100px",
                borderRadius: "10px",
              }}
            />
          )}
        </div>

        <div
          className="w-100 py-2"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <GoogleOAuthProvider clientId={`${googleClientId}`}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            />
          </GoogleOAuthProvider>
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

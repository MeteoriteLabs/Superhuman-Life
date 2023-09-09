import React, { useState, useEffect } from 'react';
import FacebookLogin from 'react-facebook-login';
import Toaster from '../../components/Toaster';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import { useLinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png';
import './socialLogin.css';

const linkedinClientId = process.env.REACT_APP_LINKEDIN_CLIENT_ID;
const redirectUriForLinkedin = process.env.REACT_APP_LINKEDIN_REDIRECT_URI;
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

const SocialLogin: React.FC = () => {
    const [login, setLogin] = useState<boolean>(false);
    const [data, setData] = useState({});
    // const [picture, setPicture] = useState<string>("");

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
                                console.log('Login Failed');
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
};

export default SocialLogin;

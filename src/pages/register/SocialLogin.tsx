import React from 'react';

const SocialLogin = (props: any) => {
    return (
        <div>
            <label>Or</label>
            <div style={{ display: 'flex', flexDirection: 'row'}}>
                <div>
                <img
                    src="/assets/linkedin_signin.svg"
                    style={{ cursor: 'pointer' }}
                    height="70px"
                    className="d-block w-100"
                    alt="sapien-exercise"
                    onClick={() => console.log('linkedin')}
                />
                </div>
                <div>
                <img
                    src="/assets/insta_signin.svg"
                    style={{ cursor: 'pointer' }}
                    height="70px"
                    className="d-block w-100"
                    alt="sapien-exercise"
                    onClick={() => console.log('instagram')}
                />
                </div>
                <div>
                <img
                    src="/assets/facebook_signin.svg"
                    style={{ cursor: 'pointer' }}
                    height="70px"
                    className="d-block w-100"
                    alt="sapien-exercise"
                    onClick={() => console.log('facebook')}
                />
                </div>
                <div>
                <img
                    src="/assets/google_signin.svg"
                    style={{ cursor: 'pointer' }}
                    height="70px"
                    className="d-block w-100"
                    alt="sapien-exercise"
                    onClick={() => console.log('google')}
                />
                </div>
            </div>
            <br />
            <span>Have an account already? <a href='/login' style={{ color: 'red'}}>Sign In</a></span>
        </div>
    );
};

export default SocialLogin;
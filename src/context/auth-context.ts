import React from 'react';

const auth: any = {
    token: null,
    username: null,
    userid: null
    // login: (token: any, username: any,userid: any) => { },
    // logout: () => { }
};

export default React.createContext(auth);

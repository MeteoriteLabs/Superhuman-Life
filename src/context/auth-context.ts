import React from "react";

const auth: any = {
    token: null,
    username: null,
    login: (token: any, username: any) => { },
    logout: () => { }
}

export default React.createContext(auth);

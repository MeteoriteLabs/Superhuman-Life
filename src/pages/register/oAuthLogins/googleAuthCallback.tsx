import React, {useEffect, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleAuthCallback = (props: any) => {

     const [auth, setAuth] = useState<any>()
     const location = useLocation()


     useEffect(() => {
          if (!location) {
            return
          }
          const { search } = location
          axios({
            method: 'GET',
            url: `https://apidev44.sapien.systems/api/auth/google/callback?${search}`,
          })
            .then((res) => res.data)
            .then(setAuth)
     }, [location])

     return (
          <div>
               {auth && (
               <>
                    <div>Jwt: {auth.jwt}</div>
                    <div>User Id: {auth.user.id}</div>
                    <div>Provider: {auth.user.provider}</div>
               </>
               )}
          </div>
     );
};

export default GoogleAuthCallback;
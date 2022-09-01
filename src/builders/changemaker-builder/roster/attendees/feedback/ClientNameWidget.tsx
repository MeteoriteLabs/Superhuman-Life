import React, { useState, useContext } from "react";
import AuthContext from "../../../../../context/auth-context";
import { useQuery } from "@apollo/client";

import { GET_CLIENT_DATA } from "../../../../client-builder/clientlisting/queries";
function ClientNameWidget() {
     const last = window.location.pathname.split("/").pop();
     const auth = useContext(AuthContext);
     const [clientName, setClientName] = useState<any>(" ");

     function FetchData(_variables: {} = { id: auth.userid, clientid: last }) {
          useQuery(GET_CLIENT_DATA, { variables: _variables, onCompleted: loadData });
     }
     function loadData(data: any) {
          [...data.userPackages].map((Detail) => {
               setClientName(Detail.users_permissions_user.username);
               return {};
          });
     }
     FetchData({ id: auth.userid, clientid: last });
     return (
          <div>
               <h5> Feedback For {clientName}</h5>
          </div>
     );
}

export default ClientNameWidget;

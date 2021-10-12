import { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { SideNav } from "./side";
import { AuthenticatedNav, UnauthenticatedNav } from "./top";
import { useLocation } from "react-router-dom";

export default function Layout({ token, children }: any) {
  const [collapse, setCollapse] = useState<boolean>(true);
  const [sideNavStatus, setSideNavStatus] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    getSideNavStatus();
  }, [location.pathname]);

  const getSideNavStatus = () => {
    const currentSideNavStatus:boolean = location.pathname !== "/lobby" ? true : false;
    setSideNavStatus(currentSideNavStatus)
  }
  return (
    <>
      <header>
        {token ? <AuthenticatedNav /> : <UnauthenticatedNav />}
      </header>
       <main> 

         {token ? ( 
           <div>
           {sideNavStatus ?
             <Row noGutters className="bg-light mt-5 py-4  min-vh-100">
               <Col lg={collapse ? "1" : "2"} className="d-none d-lg-block">
                 <SideNav collapse={collapse} setCollapse={setCollapse} />
               </Col>
               <Col lg={collapse ? "11" : "10"} className="pr-2">
                 <hr />
                 {children}
               </Col>
             </Row> :
             <div>{children}</div>      
           } 
           </div>
         ) : (
          <div>
           <>{children}</>  
          </div>
         )}

        
      </main>
      {/* <footer className="float-right p-2">
        <p className="text-muted">
          2021 ©{" "}
          <a href="https://sapien.systems/" target="_blank" rel="noreferrer">
            Sapien
            </a>{" "}
            - Partner Dashboard
          </p>
      </footer> */}
    </>
  );
}

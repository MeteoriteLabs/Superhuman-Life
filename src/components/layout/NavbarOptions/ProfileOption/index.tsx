import { useContext } from "react";
import {
  NavDropdown
} from "react-bootstrap";
import authContext from "../../../../context/auth-context";

export function ProfileOption() {
  const auth = useContext(authContext);

  return (
    <NavDropdown
      alignRight
      title={<img
        src="/assets/navbar_icons/profileIcon.svg"
        className="rounded-circle img-responsive "
        alt="avatar"
        style={{ height: '25px', width: '25px', backgroundColor: '#F2F2F2' }}
      />}
      id="collasible-nav-dropdown"
      className="position-static"
    >

      <NavDropdown.Item style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Hey there!</NavDropdown.Item>

      <NavDropdown.Item href="/profile" style={{ backgroundColor: '#D9D9D9', fontWeight: 'bold' }}>My Profile</NavDropdown.Item>
      <NavDropdown.Item href="/settings" style={{ backgroundColor: '#D9D9D9', fontWeight: 'bold' }}>Settings</NavDropdown.Item>
      <NavDropdown.Item style={{ backgroundColor: '#8B0000', fontWeight: 'bold', color: 'white' }} onClick={() => auth.logout()}>Logout</NavDropdown.Item>
    </NavDropdown>
  );
}





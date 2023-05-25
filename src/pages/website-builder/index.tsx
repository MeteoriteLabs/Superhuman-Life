import { FC, useState } from 'react';

import SideNav from './layout/sidenav';

const WebsiteBuilder: FC = () => {
  const [collapse, setCollapse] = useState<boolean>(true);

  return (
    <>
      <SideNav collapse={collapse} setCollapse={setCollapse} />
    </>
  );
};

export default WebsiteBuilder;

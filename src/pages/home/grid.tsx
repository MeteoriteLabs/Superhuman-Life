import UpcomingCard from "./UpcomingCard";
import LeadCard from "./LeadCard/index";
import "react-grid-layout/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import LinksCard from "./Links";
import TaskCard from "./TaskCard";
import GraphSelector from "./GraphSelector";
// import 'react-resizable/css/styles.css';
// const ResponsiveGridLayout = WidthProvider(Responsive);

// Handles the responsive nature of the grid
const ResponsiveGridLayout = WidthProvider(Responsive);
// Determines the screen breakpoints for the columns
const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 320 };
// How many columns are available at each breakpoint
const cols = { lg: 4, md: 4, sm: 1, xs: 1, xxs: 1 };

function Grid() {
  var layout = [
    { i: "lead", x: 0, y: 0, w: 1, h: 1, maxW: 4 },
    { i: "offerings", x: 1, y: 0, w: 1, h: 1 },
    { i: "links", x: 2, y: 0, w: 1, h: 1 },
    {
      i: "graphs",
      x: 0,
      y: 3,
      w: 3,
      h: 2,
      minW: 6,
      maxW: Infinity,
      minH: 2,
      maxH: Infinity,
      isDraggable: true,
      isResizable: true,
    },
  ];

  const getLayouts = () => {
    const savedLayouts = localStorage.getItem("grid-layout");
    return savedLayouts ? JSON.parse(savedLayouts) : { lg: layout };
  };

  const handlelayoutChange = (layout, layouts) => {
    localStorage.setItem("grid-layout", JSON.stringify(layouts));
  };

  return (
    // <ResponsiveGridLayout
    //   className="layout"
    //   layouts={getLayouts()}
    //   breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
    //   cols={{ lg: 2, md: 4, sm: 3, xs: 2, xxs: 1 }}
    //   // cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    //   preventCollision={true}
    //   rowHeight={420}
    //   width={1200}
    //   allowOverlap={false}
    //   onLayoutChange={handlelayoutChange}
    //   autoSize={true}
    //   isResizeable={true}
    //   isDraggable
    //   isRearrangeable
    //   isResizable
    //   margin={[10, 10]}
    //   // margin={{
    //   //   lg: [30, 30],
    //   //   md: [20, 20],
    //   //   sm: [20, 20],
    //   //   xs: [20, 20],
    //   //   xxs: [20, 20],
    //   // }}
    // >
    //   <div key="lead">
    //     <LeadCard />
    //   </div>
    //   <div key="offerings">
    //     <UpcomingCard />
    //   </div>
    //   <div key="links">
    //     <LinksCard />
    //   </div>
    //   <div key="graphs">
    //     <GraphSelector />
    //   </div>
    // </ResponsiveGridLayout>

    <div className="w-full">
      {/* <header className="flex bg-gray-900 m-5 p-5 shadow-lg rounded-lg">
  <h1 className="text-2xl text-teal-400">PB Tech Dashboard</h1>
</header> */}

      <ResponsiveGridLayout
        className="my-5 mx-8"
        breakpoints={breakpoints}
        cols={cols}
        allowOverlap={false}
        onLayoutChange={handlelayoutChange}
      >
        <div
          className="grid-cell"
          key="1"
          data-grid={{ x: 0, y: 0, w: 1, h: 3 }}
        >
          <LeadCard />
        </div>

        <div
          className="grid-cell"
          key="2"
          data-grid={{ x: 1, y: 0, w: 1, h: 3 }}
        >
          <UpcomingCard />
        </div>
        <div
          className="grid-cell"
          key="3"
          data-grid={{ x: 2, y: 0, w: 1, h: 3 }}
        >
          <TaskCard />
        </div>
        <div
          className="grid-cell"
          key="4"
          data-grid={{ x: 3, y: 0, w: 1, h: 2 }}
        >
          <LinksCard />
        </div>
        {/* <div
    className="grid-cell"
    key="5"
    data-grid={{ x: 0, y: 3, w: 4, h: 2 }}
  >
    
  </div> */}
      </ResponsiveGridLayout>
      <GraphSelector />
    </div>
  );
}

export default Grid;

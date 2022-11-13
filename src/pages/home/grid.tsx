import UpcomingCard from "./UpcomingCard";
import LeadCard from "./LeadCard/index";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

function Grid() {
  var layout = [
    { i: "lead", x: 0, y: 0, w: 1, h: 1 },
    { i: "offerings", x: 1, y: 0, w: 1, h: 1 },
  ];

  const getLayouts = () => {
    const savedLayouts = localStorage.getItem("grid-layout");
    return savedLayouts ? JSON.parse(savedLayouts) : { lg: layout };
  };

  const handlelayoutChange = (layout, layouts) => {
    localStorage.setItem("grid-layout", JSON.stringify(layouts));
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={getLayouts()}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 3, md: 4, sm: 3, xs: 2, xxs: 1 }}
      rowHeight={420}
      width={1200}
      allowOverlap={false}
      onLayoutChange={handlelayoutChange}
      margin = {[10, 10]} 
      
    >
      <div key="lead">
        <LeadCard />
      </div>
      <div key="offerings">
        <UpcomingCard />
      </div>
    </ResponsiveGridLayout>
  );
}

export default Grid;

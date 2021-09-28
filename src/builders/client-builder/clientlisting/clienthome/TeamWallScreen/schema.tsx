import TagSearch from "./TagSearch";
import Widget from "./Widget";
import ClientName from "./ClientNameWidget";
export const widgets = {
     PackageSearch: TagSearch,
     Widget: Widget,
     ClientNameWidget: ClientName,
};

export const schema: any = {
     packagesearch: {
          "ui:widget": "PackageSearch",
     },
     widget: {
          "ui:widget": "Widget",
     },
     clientname: {
          "ui:widget": "ClientNameWidget",
     },
};

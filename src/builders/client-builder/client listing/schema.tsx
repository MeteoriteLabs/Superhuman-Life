import PackageSearch from "./searchpackagecomponent/searchpackage";
import Additionalinfo from "./clientWidgets/additionalinfo";
export const widgets = {
     PackageSearch: PackageSearch,
     Additionalinfo: Additionalinfo,
};

export const schema: any = {
     packagesearch: {
          "ui:widget": "PackageSearch",
     },
     additionalinfo: {
          "ui:widget": "Additionalinfo",
     },
};

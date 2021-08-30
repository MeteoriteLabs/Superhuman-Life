import PackageSearch from "./searchpackagecomponent/searchpackage";
export const widgets = {
     PackageSearch: PackageSearch,
};

export const schema: any = {
     packagesearch: {
          "ui:widget": "PackageSearch",
     },
};

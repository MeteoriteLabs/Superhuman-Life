export const flattenObj = (data) => {
    const isObject = (data) =>
        Object.prototype.toString.call(data) === "[object Object]";
    const isArray = (data) =>
        Object.prototype.toString.call(data) === "[object Array]";

    const flatten = (data) => {
        if (!data.attributes) return data;

        return {
        id: data.id,
        ...data.attributes,
        };
    };

    if (isArray(data)) {
        return data.map((item) => flattenObj(item));
    }

    if (isObject(data)) {
        if (isArray(data.data)) {
        data = [...data.data];
        } else if (isObject(data.data)) {
        data = flatten({ ...data.data });
        } else if (data.data === null) {
        data = null;
        } else {
        data = flatten(data);
        }

        for (const key in data) {
            // if("data" in data[key]) {
            //     // where [data[key]["data"]] is an object 
            //     //type object
            //     if(isObject(data[key]["data"])){
            //         if("id" in data[key]["data"] && "attributes" in data[key]["data"]){
            //             data[key] = flattenObj(data[key]);
            //         }else {
            //             continue;
            //         }
            //     }
            //     //type array
            //     else if(isArray(data[key]["data"])){
            //         // if array look for id and attributes key at index 0.
            //         if("id" in data[key]["data"][0] && "attributes" in data[key]["data"][0]){
            //             data[key] = flattenObj(data[key]);
            //         }else {
            //             continue;
            //         }
            //     }else {
            //         continue;
            //     }
            // }else {
            //     // data[key] = flattenObj(data[key]);
            //     continue
            // }
            if(key === "fitnesspackagepricing" || key === "events" || key === "rest_days" || key === "Changemaker_weekly_schedule") {
                continue;
            }else {
                data[key] = flattenObj(data[key]);
            }

        }

        return data;
    }

    return data;
    };
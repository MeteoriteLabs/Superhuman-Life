//contact number
export const phoneCustomFormats = {
    'phone-in': /^[6-9]{1}[0-9]{9}$/
};

export function phoneTransformErrors(errors) {
    return errors.map(error => {
        if (error.name === "format") {
            error.message = "Phone number must be valid and contains 10 digits"
        }
        return error;
    });
}

//zipcode
export const zipcodeCustomFormats = {
    'zipcode': /^(\d{5}|\d{6})$/
};

export function zipcodeTransformErrors(errors) {
    return errors.map(error => {
        if (error.name === "format") {
            error.message = "Enter correct zipcode of 6 digits"
        }
        return error;
    });
}

// year validation
export const yearCustomFormats = {
    'year': /^(\d{4})$/
};

export function yearTransformErrors(errors) {
    return errors.map(error => {
        if (error.name === "format") {
            error.message = "Enter correct year in YYYY format"
        }
        return error;
    });
}

// URL validation
export const urlCustomFormats = {
    // eslint-disable-next-line
    'url': /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
};

export function urlTransformErrors(errors) {
    return errors.map(error => {
        if (error.name === "format") {
            error.message = "Enter correct URL eg: https://www.abc.com"
        }
        return error;
    });
}

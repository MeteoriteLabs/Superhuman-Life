//contact number
export const phoneCustomFormats = {
    'phone-in': /^[6-9]{1}[0-9]{9}$/
};

export const phoneTransformErrors = (errors: any[]): any[] => {
    return errors.map((error) => {
        if (error.name === 'format') {
            error.message = 'Phone number must be valid and contains 10 digits';
        }
        return error;
    });
};

//zipcode
export const zipcodeCustomFormats = {
    zipcode: /^(\d{5}|\d{6})$/
};

export function zipcodeTransformErrors(errors) {
    return errors.map((error) => {
        if (error.name === 'format') {
            error.message = 'Enter correct zipcode of 6 digits';
        }
        return error;
    });
}

// year validation
export const yearCustomFormats = {
    year: /^(\d{4})$/
};

export function yearTransformErrors(errors) {
    return errors.map((error) => {
        if (error.name === 'format') {
            error.message = 'Enter correct year in YYYY format';
        }
        return error;
    });
}

// URL validation
export const urlCustomFormats = {
    // eslint-disable-next-line
    url: /^(|https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)$/
};

export function urlTransformErrors(errors) {
    return errors.map((error) => {
        if (error.name === 'format') {
            error.message = 'Enter correct URL eg: https://www.abc.com';
        }
        return error;
    });
}

// Youtube URL validation
export const youtubeUrlCustomFormats = {
    // eslint-disable-next-line
    youtubeurl:
        /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
};

export function youtubeUrlTransformErrors(errors) {
    return errors.map((error) => {
        if (error.name === 'format') {
            error.message = 'Enter correct youtube video URL';
        }
        return error;
    });
}

// Regular expression pattern for validating Indian phone numbers
export const indianPhoneNumberPattern = /^[6-9]\d{9}$/;

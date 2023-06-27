const containsSubstring = (str: string, substring: string): boolean => {
    const regex = new RegExp(substring, 'i');
    return regex.test(str);
};

export default containsSubstring;

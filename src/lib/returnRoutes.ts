
 const returnRoute = (type: string): string | null => {
    switch (type) {
        case 'Home':
            return '/';
        case 'Classes':
            return '/classes';
        case 'About':
            return '/aboutUs';
        case 'Contact':
            return '/contact';
        case 'Offerings':
            return '/offerings';
        default:
            return '/';
    }
};
export default returnRoute
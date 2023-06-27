export const SetFirstLetterToUpperCase = (str: string): string => {
    return str.split('')[0].toUpperCase() + str.split('').splice(1).join('')
}

export const SplitAtUpperCase = (str: string): string => {
    return str.split(/(?=[A-Z])/).join(' ')
}

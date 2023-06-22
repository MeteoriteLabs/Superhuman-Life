export const SetFirstLetterToUpperCase = (str: string): string => {
return str.split('')[0].toUpperCase() + str.split('').splice(1).join('')
}

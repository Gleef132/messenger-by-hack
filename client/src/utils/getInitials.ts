export const getInitials = (text:string) => {
  return text.split(' ').map(item => item[0].toUpperCase()).join('')
}
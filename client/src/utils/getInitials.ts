export const getInitials = (text:string):string => {
  if (!text) return ''
  return text.split(' ').filter(item => item).map(item => item[0].toUpperCase()).join('')
}

export const setCookie = (key:string,value:string) => {
  if(typeof window !== 'undefined'){
    document.cookie = `${key}=${value}`
  }
}
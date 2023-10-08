import {atom, selector} from 'recoil'

export const ceshi = atom({
    key:'ceSHI1',
    default: '',

}) 
export const tempCelsius = selector({
    key: 'tempCelsius',
    get: ({get}) => get(ceshi).toLocaleUpperCase(),

  });
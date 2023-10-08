import { atom } from 'recoil'

export const locationState = atom({
  key: 'locationState',
  default: {
    latitude: -33.8,
    longitude: 151.01,
    //variable needed, unchanged
    hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
    timezone: "Australia/Sydney",
  },
});
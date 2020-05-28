import axios, { AxiosResponse } from 'axios';
import { API } from '../constants';
import { UserLocation } from '../App'

export type Weather = {
  description: string,
  icon: string,
  id: Number,
  main: string,
  degrees: Number
}

export const getWeatherForLocation = async (location: UserLocation): Promise<Weather> => {
  const URL = `${API}weather?lat=${location.latt}&lon=${location.long}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`

  return axios.get(URL)
    .then((response: AxiosResponse) => {
      const { data } = response;
      const weather: Weather = {
        ...data.weather[0],
        degrees: data.main.temp
      }
      return weather;
    })

}

export const getWeatherForCity = async (cityName: string): Promise<Weather> => {
  const URL = `${API}weather?q=${cityName}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=metric`

  return axios.get(URL)
    .then((response: AxiosResponse) => {
      const { data } = response;
      const weather: Weather = {
        ...data.weather[0],
        degrees: data.main.temp
      }
      return weather;
    })

}

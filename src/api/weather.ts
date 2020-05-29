import axios, { AxiosResponse, AxiosError } from 'axios';
import { API, API_KEY } from '../constants';
import { UserLocation } from '../App';

export type Weather = {
  description: string;
  icon: string;
  id: Number;
  main: string;
  degrees: Number;
};

export const getWeatherForLocation = async (
  location: UserLocation
): Promise<Weather | string> => {
  const URL = `${API}weather?lat=${location.latt}&lon=${location.long}&appid=${API_KEY}&units=metric`;

  return axios
    .get(URL)
    .then((response: AxiosResponse) => {
      const { data } = response;
      const weather: Weather = {
        ...data.weather[0],
        degrees: Math.floor(data.main.temp),
      };
      return weather;
    })
    .catch((e: AxiosError) => e.message);
};

export const getWeatherForCity = async (
  cityName: string
): Promise<Weather | string> => {
  const URL = `${API}weather?q=${cityName}&appid=${API_KEY}&units=metric`;

  return axios
    .get(URL)
    .then((response: AxiosResponse) => {
      const { data } = response;
      const weather: Weather = {
        ...data.weather[0],
        degrees: Math.floor(data.main.temp),
      };
      return weather;
    })
    .catch((e: AxiosError) => e.message);
};

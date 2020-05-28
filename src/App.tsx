import React, { Component } from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { getWeatherForLocation, Weather, getWeatherForCity } from './api/weather';
import { BackgroundColors, StaticContentAPI } from './constants';

interface AppState {
  loading: boolean;
  errorMsg: string;
  userLocation: UserLocation;
  weatherCondition: Weather;
  searchCity: string
}

export type UserLocation = {
  latt: number,
  long: number
}

class App extends Component<{}, AppState> {
  state = {
    loading: true,
    errorMsg: '',
    userLocation: {
      latt: 0,
      long: 0,
    },
    weatherCondition: {
      description: '',
      icon: '',
      id: 0,
      main: '',
      degrees: 0
    },
    searchCity: ''
  }

  // Get weather data for users current location
  async componentDidMount() {
    // request users location
    navigator.geolocation.getCurrentPosition(this.onLocationGet, this.onLocationGetFail);
  }

  onLocationGet = (position: Position) => {
    this.setState({
      userLocation: {
        latt: position.coords.latitude, long: position.coords.longitude
      }
    }, async () => {
      const { latt, long } = this.state.userLocation;
      const weatherCondition = await getWeatherForLocation({ latt, long });
      this.setState({ weatherCondition, loading: false })
    })
  };

  onLocationGetFail = (error: PositionError) => this.setState({
    errorMsg: 'Unable to get your location',
    loading: false
  })

  search = async () => {
    const { searchCity } = this.state;

    this.setState({
      loading: true
    }, async () => {
      const weather = await getWeatherForCity(searchCity);

      console.log(`weather for city ${searchCity}: \n`, weather);

      this.setState({
        loading: false,
        weatherCondition: weather,
        errorMsg: ''
      })
    })
  }

  // returns HEX of background color representing current weather status
  getBackground = (): string => {
    const {
      weatherCondition: { degrees },
      loading
    } = this.state;

    if (loading) { return BackgroundColors.default }

    if (degrees <= -10) {
      return BackgroundColors.snow
    } else if (degrees > -10 && degrees <= 10) {
      return BackgroundColors.cool
    } else if (degrees > 10 && degrees < 30) {
      return BackgroundColors.warm
    } else if (degrees > 30) {
      return BackgroundColors.hot
    } else {
      return BackgroundColors.default
    }
  }

  // returns URL of icon representing current weather status
  getWeatherIcon = (): string => {
    const { weatherCondition: { icon } } = this.state;

    return `${StaticContentAPI}/img/wn/${icon}@2x.png`
  }

  render(): JSX.Element {
    const backgroundColor = this.getBackground()
    const weatherIcon = this.getWeatherIcon()
    const {
      weatherCondition: {
        description
      },
      loading,
      errorMsg
    } = this.state;
    return (
      <div className="pageContainer" style={{ backgroundColor }}>
        {
          loading ?
            <ClipLoader
              size={50}
              color={"#123abc"}
              loading={this.state.loading}
            />
            :
            (
              <div className="pageContent">
                <div className="searchBarContainer">
                  <input className="searchInput" placeholder="Enter city name" onChange={(event: any) => {
                    this.setState({
                      searchCity: event.target.value
                    })
                  }} />
                  <button type="button" className="searchButton" onClick={this.search}>Search</button>
                </div>

                {
                  errorMsg ? <h1 className="errorLabel">{errorMsg}</h1> :
                    (
                      <div className="weatherResults">
                        <img src={weatherIcon} className="weatherIcon" alt="Weather Icon" />
                        <p className="resultsLabel">It's {description}</p>
                      </div>
                    )
                }
              </div>
            )
        }
      </div>
    );
  }
}

export default App;

'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Loader2, MapPin, Sunrise, Sunset, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import axios from 'axios'
import { ForecastSection } from './ForecastSection'
import { DynamicBackground } from './DynamicBackground'

// Updated function for fetching weather data from Visual Crossing API
const fetchWeatherData = async (city: string) => {
  const apiKey = 'YUEZKFY9NNTBEXK3HR2JRK2E2'; // Temporary hardcoded key
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&key=${apiKey}&contentType=json&include=current`

  try {
    const response = await axios.get(url)
    const data = response.data
    console.log('API Response:', data)
    console.log('Current Conditions:', data.currentConditions)

    if (!data.address) {
      throw new Error('City not found')
    }

    const fullName = data.resolvedAddress || data.address

    const weatherData: WeatherData = {
      city: data.address,
      fullName: fullName,
      condition: data.currentConditions.conditions.toLowerCase(),
      temperature: data.currentConditions.temp,
      humidity: data.currentConditions.humidity,
      windSpeed: data.currentConditions.windspeed,
      forecast: data.days.slice(1, 8).map((day: any) => ({
        date: day.datetime,
        tempmax: day.tempmax,
        tempmin: day.tempmin,
        condition: day.conditions,
        icon: day.icon
      }))
    }
    console.log('Processed Weather Data:', weatherData)

    return weatherData
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('City not found')
      } else if (error.response?.status === 400) {
        throw new Error('Invalid city name')
      } else if (error.response?.status === 429) {
        throw new Error('Too many requests. Please try again later.')
      } else {
        throw new Error('An error occurred while fetching weather data')
      }
    } else {
      throw error
    }
  }
}

type WeatherData = {
  city: string
  fullName: string
  condition: string
  temperature: number
  humidity: number
  windSpeed: number
  forecast: ForecastDay[]
}

type ForecastDay = {
  date: string
  tempmax: number
  tempmin: number
  condition: string
  icon: string
}

// Helper function to get weather condition from Windy data
const getConditionFromWindy = (data: any): string => {
  if (data.precip > 0) return 'rainy'
  if (data.rh > 80) return 'cloudy'
  return 'sunny' // Default to sunny if no other condition is met
}

// Helper function to get background color based on condition
const getBackgroundColor = (condition: string) => {
  if (condition.includes('sun') || condition.includes('clear')) return 'from-yellow-200 to-orange-300'
  if (condition.includes('cloud') || condition.includes('overcast')) return 'from-gray-300 to-gray-400'
  if (condition.includes('rain') || condition.includes('drizzle')) return 'from-blue-200 to-blue-300'
  return 'from-gray-100 to-gray-200'
}

// Helper function to get weather icon based on condition
const getWeatherIcon = (condition: string) => {
  if (condition.includes('sun') || condition.includes('clear')) return <Sun className="h-16 w-16 text-yellow-500" />
  if (condition.includes('cloud') || condition.includes('overcast')) return <Cloud className="h-16 w-16 text-gray-500" />
  if (condition.includes('rain') || condition.includes('drizzle')) return <CloudRain className="h-16 w-16 text-blue-500" />
  return null
}

export function StunningWeatherAppComponent() {
  console.log('API Key in component:', process.env.NEXT_PUBLIC_VISUAL_CROSSING_API_KEY)
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [recentCities, setRecentCities] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await fetchWeatherData(city)
      setWeather(data)
      updateRecentCities(data)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setCity('')
    setError('')
  }

  const updateRecentCities = (newCity: WeatherData) => {
    setRecentCities(prev => {
      const filtered = prev.filter(c => c.city !== newCity.city)
      return [newCity, ...filtered].slice(0, 2)
    })
  }

  return (
    <div className="min-h-screen relative">
      {weather && <DynamicBackground condition={weather.condition} />}
      <div className="relative z-10 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-6xl flex flex-col items-center gap-8">
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="bg-white/20 py-4">
              <CardTitle className="text-3xl font-bold text-center text-white">Weather Forecast</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter city name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="pl-10 pr-10 bg-white/50 border-0 focus:ring-2 focus:ring-indigo-500 rounded-full text-gray-800 placeholder-gray-500"
                  />
                  {city && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-all duration-300 transform hover:scale-105" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get Weather'}
                  </Button>
                  <Button type="button" onClick={handleClear} className="bg-gray-500 hover:bg-gray-600 rounded-full transition-all duration-300 transform hover:scale-105">
                    Clear
                  </Button>
                </div>
              </form>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 mt-4 text-center bg-white/10 rounded-full py-2 px-4"
                >
                  {error}
                </motion.p>
              )}
            </CardContent>
          </Card>

          {weather && (
            <div className="w-full flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-1/4">
                <ForecastSection forecast={weather.forecast} />
              </div>
              
              <div className="w-full md:w-1/2">
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
                      <CardContent className="p-6">
                        <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${getBackgroundColor(weather.condition)}`}>
                          <WeatherAnimation condition={weather.condition} />
                          <div className="relative z-10">
                            <div className="flex justify-between items-center mb-4">
                              <h2 className="text-2xl font-bold text-white">{weather.fullName}</h2>
                              {getWeatherIcon(weather.condition)}
                            </div>
                            <p className="text-5xl font-bold text-white mb-2">{Math.round(weather.temperature)}°C</p>
                            <p className="text-xl text-white capitalize mb-4">{weather.condition}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex items-center bg-white/20 rounded-full p-2">
                                <Droplets className="h-5 w-5 text-white mr-2" />
                                <p className="text-sm text-white">{weather.humidity}% Humidity</p>
                              </div>
                              <div className="flex items-center bg-white/20 rounded-full p-2">
                                <Wind className="h-5 w-5 text-white mr-2" />
                                <p className="text-sm text-white">{weather.windSpeed} km/h Wind</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              <div className="w-full md:w-1/4">
                <Card className="bg-white/10 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
                  <CardHeader className="bg-white/20 py-4">
                    <CardTitle className="text-2xl font-bold text-center text-white">Recent Searches</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {recentCities.length > 0 ? (
                      <div className="space-y-4">
                        {recentCities.map((cityData, index) => (
                          <motion.div
                            key={cityData.city}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="bg-white/10 backdrop-blur-md shadow-lg rounded-2xl overflow-hidden">
                              <CardContent className="p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className="text-sm font-semibold text-white">{cityData.fullName}</h4>
                                  {getWeatherIcon(cityData.condition)}
                                </div>
                                <p className="text-2xl font-bold text-white mb-1">{Math.round(cityData.temperature)}°C</p>
                                <p className="text-xs text-gray-200 capitalize mb-1">{cityData.condition}</p>
                                <div className="flex justify-between text-xs text-gray-300">
                                  <span>{cityData.humidity}% Humidity</span>
                                  <span>{cityData.windSpeed} km/h Wind</span>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white text-center">No recent searches</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced WeatherAnimation component
const WeatherAnimation = ({ condition }: { condition: string }) => {
  const animationProps = {
    sunny: {
      component: Sun,
      color: "text-yellow-400",
      animation: {
        y: [0, -10, 0],
        scale: [1, 1.1, 1],
        transition: { repeat: Infinity, duration: 3 }
      }
    },
    cloudy: {
      component: Cloud,
      color: "text-gray-400",
      animation: {
        x: [-20, 20, -20],
        transition: { repeat: Infinity, duration: 5 }
      }
    },
    rainy: {
      component: CloudRain,
      color: "text-blue-400",
      animation: {
        y: [0, 10, 0],
        transition: { repeat: Infinity, duration: 1.5 }
      }
    }
  };

  const AnimatedIcon = animationProps[condition as keyof typeof animationProps]?.component || Sun;
  const iconColor = animationProps[condition as keyof typeof animationProps]?.color || "text-yellow-400";
  const animation = animationProps[condition as keyof typeof animationProps]?.animation || {};

  return (
    <div className="absolute top-4 right-4">
      <motion.div
        animate={animation}
      >
        <AnimatedIcon className={`h-16 w-16 ${iconColor}`} />
      </motion.div>
    </div>
  );
};
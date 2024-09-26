import { Card, CardContent } from "@/components/ui/card"
import { Sun, Cloud, CloudRain } from "lucide-react"

type ForecastDay = {
  date: string
  tempmax: number
  tempmin: number
  condition: string
  icon: string
}

const getWeatherIcon = (condition: string) => {
  if (condition.includes('sun') || condition.includes('clear')) return <Sun className="h-6 w-6 text-yellow-500" />
  if (condition.includes('cloud') || condition.includes('overcast')) return <Cloud className="h-6 w-6 text-gray-500" />
  if (condition.includes('rain') || condition.includes('drizzle')) return <CloudRain className="h-6 w-6 text-blue-500" />
  return null
}

export const ForecastSection = ({ forecast }: { forecast: ForecastDay[] }) => (
  <Card className="bg-white/10 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden">
    <CardContent className="p-4">
      <h3 className="text-xl font-bold text-white mb-4">7-Day Forecast</h3>
      <div className="space-y-2">
        {forecast.map((day) => (
          <div key={day.date} className="flex items-center justify-between bg-white/10 rounded-full p-2">
            <p className="text-xs font-semibold text-white w-8">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <div className="flex items-center space-x-2">
              {getWeatherIcon(day.condition.toLowerCase())}
              <p className="text-xs text-gray-200 capitalize w-16 truncate">{day.condition}</p>
            </div>
            <div className="flex space-x-2 text-xs text-white">
              <span>{Math.round(day.tempmin)}°</span>
              <span>{Math.round(day.tempmax)}°</span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)
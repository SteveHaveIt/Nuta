import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const FlashSaleBanner = ({ flashSale }) => {
  const [timeLeft, setTimeLeft] = useState({})

  useEffect(() => {
    if (!flashSale) return

    const calculateTimeLeft = () => {
      const difference = new Date(flashSale.endDate) - new Date()
      
      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      } else {
        setTimeLeft({})
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [flashSale])

  if (!flashSale || Object.keys(timeLeft).length === 0) return null

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-red-600 via-orange-500 to-red-600 text-white py-4 px-6 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <Zap className="w-8 h-8" fill="currentColor" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold">{flashSale.name}</h3>
            <p className="text-sm opacity-90">{flashSale.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <div className="flex gap-2">
              <div className="bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-xs block">Hours</span>
              </div>
              <div className="bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-xs block">Mins</span>
              </div>
              <div className="bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-xs block">Secs</span>
              </div>
            </div>
          </div>

          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-red-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-shadow"
            >
              Shop Now
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default FlashSaleBanner

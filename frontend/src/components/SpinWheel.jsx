import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import api from '../config/api'

const SpinWheel = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [canSpin, setCanSpin] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [prizes, setPrizes] = useState([])

  useEffect(() => {
    if (isOpen) {
      fetchConfig()
    }
  }, [isOpen])

  const fetchConfig = async () => {
    try {
      const response = await fetch(`${api.API_BASE_URL || 'http://localhost:3001/api'}/marketing/spin-wheel/config`)
      const data = await response.json()
      if (data.config) {
        setPrizes(data.config.prizes)
      }
    } catch (error) {
      console.error('Error fetching spin wheel config:', error)
    }
  }

  const checkCanSpin = async () => {
    if (!email && !phone) return
    
    try {
      const params = new URLSearchParams()
      if (email) params.append('email', email)
      if (phone) params.append('phone', phone)
      
      const response = await fetch(`${api.API_BASE_URL || 'http://localhost:3001/api'}/marketing/spin-wheel/can-spin?${params}`)
      const data = await response.json()
      setCanSpin(data.canSpin)
    } catch (error) {
      console.error('Error checking spin eligibility:', error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      checkCanSpin()
    }, 500)
    return () => clearTimeout(timer)
  }, [email, phone])

  const handleSpin = async () => {
    if (!email || spinning || !canSpin) return

    setSpinning(true)
    
    try {
      const response = await fetch(`${api.API_BASE_URL || 'http://localhost:3001/api'}/marketing/spin-wheel/spin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Calculate rotation based on prize
        const prizeIndex = prizes.findIndex(p => p.label === data.prize.label)
        const segmentAngle = 360 / prizes.length
        const targetRotation = 360 * 5 + (prizeIndex * segmentAngle) // 5 full rotations + target
        
        setRotation(targetRotation)
        
        setTimeout(() => {
          setResult(data)
          setSpinning(false)
        }, 4000)
      }
    } catch (error) {
      console.error('Error spinning wheel:', error)
      setSpinning(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative w-full max-w-2xl mx-4 bg-gradient-to-br from-accent/20 to-white rounded-2xl shadow-2xl p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {!result ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Gift className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-primary">Spin to Win!</h2>
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              
              <p className="text-gray-600 mb-6">
                Enter your email and spin the wheel for a chance to win amazing discounts!
              </p>

              {/* Spin Wheel */}
              <div className="relative w-80 h-80 mx-auto mb-6">
                <motion.div
                  animate={{ rotate: rotation }}
                  transition={{ duration: 4, ease: "easeOut" }}
                  className="w-full h-full rounded-full border-8 border-primary shadow-xl overflow-hidden relative"
                  style={{
                    background: `conic-gradient(
                      from 0deg,
                      ${prizes.map((_, i) => {
                        const colors = ['#f4d19b', '#d4a574', '#f4d19b', '#d4a574', '#f4d19b', '#d4a574']
                        return `${colors[i % colors.length]} ${(i * 100 / prizes.length)}%, ${colors[i % colors.length]} ${((i + 1) * 100 / prizes.length)}%`
                      }).join(', ')}
                    )`
                  }}
                >
                  {prizes.map((prize, index) => {
                    const angle = (360 / prizes.length) * index
                    return (
                      <div
                        key={index}
                        className="absolute top-1/2 left-1/2 origin-left"
                        style={{
                          transform: `rotate(${angle}deg) translateX(50px)`,
                          width: '100px'
                        }}
                      >
                        <span className="text-sm font-bold text-primary block transform -rotate-90">
                          {prize.label}
                        </span>
                      </div>
                    )
                  })}
                </motion.div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[30px] border-l-transparent border-r-transparent border-t-red-500 z-10"></div>
              </div>

              {/* Form */}
              <div className="space-y-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <Input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full"
                />
                
                <Button
                  onClick={handleSpin}
                  disabled={!email || spinning || !canSpin}
                  className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 text-lg"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {spinning ? 'Spinning...' : canSpin ? 'SPIN NOW!' : 'Already Spun Today'}
                </Button>
                
                {!canSpin && (
                  <p className="text-sm text-red-600">
                    You've already spun today. Come back tomorrow!
                  </p>
                )}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-8"
            >
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold text-primary mb-4">
                Congratulations!
              </h3>
              <p className="text-xl mb-6">
                You won: <span className="font-bold text-primary">{result.prize.label}</span>
              </p>
              
              {result.code && (
                <div className="bg-accent/30 p-6 rounded-lg mb-6">
                  <p className="text-sm text-gray-600 mb-2">Your discount code:</p>
                  <p className="text-2xl font-bold text-primary mb-2">{result.code}</p>
                  <p className="text-sm text-gray-600">
                    Valid until: {new Date(result.expiryDate).toLocaleDateString()}
                  </p>
                </div>
              )}
              
              <Button
                onClick={onClose}
                className="bg-primary hover:bg-primary-light text-white"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Start Shopping
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default SpinWheel

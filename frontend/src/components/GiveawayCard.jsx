import { useState } from 'react'
import { motion } from 'framer-motion'
import { Gift, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const GiveawayCard = ({ giveaway, onEnter }) => {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [entered, setEntered] = useState(false)

  const handleEnter = async () => {
    if (!email) return

    setLoading(true)
    try {
      await onEnter(giveaway.id, email, phone)
      setEntered(true)
    } catch (error) {
      console.error('Error entering giveaway:', error)
    } finally {
      setLoading(false)
    }
  }

  const daysLeft = Math.ceil((new Date(giveaway.endDate) - new Date()) / (1000 * 60 * 60 * 24))

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-2 border-accent">
        <CardHeader className="bg-gradient-to-br from-accent/20 to-secondary/20">
          <div className="flex items-start justify-between">
            <Gift className="w-12 h-12 text-primary" />
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              {daysLeft} days left
            </div>
          </div>
          <CardTitle className="text-2xl mt-4">{giveaway.name}</CardTitle>
          <CardDescription>{giveaway.description}</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="bg-accent/10 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Prize:</p>
              <p className="font-bold text-lg text-primary">{giveaway.prizeDescription}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Draw Date: {new Date(giveaway.drawDate || giveaway.endDate).toLocaleDateString()}</span>
            </div>

            {!entered ? (
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  type="tel"
                  placeholder="Phone number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-500 p-4 rounded-lg text-center">
                <p className="text-green-700 font-semibold">✓ You're entered!</p>
                <p className="text-sm text-green-600">Good luck!</p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          {!entered && (
            <Button
              onClick={handleEnter}
              disabled={!email || loading}
              className="w-full bg-primary hover:bg-primary-light text-white"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {loading ? 'Entering...' : 'Enter Giveaway'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default GiveawayCard

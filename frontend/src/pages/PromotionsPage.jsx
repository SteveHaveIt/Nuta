import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Gift, Trophy, Users, Zap } from 'lucide-react'
import GiveawayCard from '../components/GiveawayCard'
import SocialContestCard from '../components/SocialContestCard'
import { Button } from '@/components/ui/button'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/'

function PromotionsPage() {
  const [giveaways, setGiveaways] = useState([])
  const [contests, setContests] = useState([])
  const [flashSales, setFlashSales] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPromotions()
  }, [])

  const fetchPromotions = async () => {
    try {
      const [giveawaysRes, contestsRes, flashSalesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/marketing/giveaways`),
        fetch(`${API_BASE_URL}/marketing/contests`),
        fetch(`${API_BASE_URL}/marketing/flash-sales`)
      ])

      const [giveawaysData, contestsData, flashSalesData] = await Promise.all([
        giveawaysRes.json(),
        contestsRes.json(),
        flashSalesRes.json()
      ])

      setGiveaways(giveawaysData.giveaways || [])
      setContests(contestsData.contests || [])
      setFlashSales(flashSalesData.flashSales || [])
    } catch (error) {
      console.error('Error fetching promotions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEnterGiveaway = async (giveawayId, email, phone) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/giveaways/enter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ giveawayId, email, phone, entryType: 'website' })
      })

      const data = await response.json()
      if (data.success) {
        alert('Successfully entered giveaway!')
      }
    } catch (error) {
      console.error('Error entering giveaway:', error)
      alert('Error entering giveaway. Please try again.')
    }
  }

  const handleSubmitContest = async (contestId, formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/contests/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contestId, ...formData })
      })

      const data = await response.json()
      if (data.success) {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error submitting contest:', error)
      alert('Error submitting entry. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/10">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-light text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h1 className="text-5xl font-bold mb-4">Win Big with Nuta!</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Participate in our exciting giveaways, contests, and flash sales for a chance to win amazing prizes!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-gradient-to-br from-accent/20 to-white rounded-xl shadow-lg"
            >
              <Gift className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-primary">{giveaways.length}</h3>
              <p className="text-gray-600">Active Giveaways</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow-lg"
            >
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-yellow-600">{contests.length}</h3>
              <p className="text-gray-600">Social Contests</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-gradient-to-br from-red-50 to-white rounded-xl shadow-lg"
            >
              <Zap className="w-12 h-12 text-red-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-red-600">{flashSales.length}</h3>
              <p className="text-gray-600">Flash Sales</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center p-6 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg"
            >
              <Users className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-3xl font-bold text-green-600">5000+</h3>
              <p className="text-gray-600">Happy Winners</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Giveaways Section */}
      {giveaways.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-primary mb-4">Active Giveaways</h2>
              <p className="text-gray-600 text-lg">Enter for a chance to win amazing prizes!</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {giveaways.map((giveaway, index) => (
                <motion.div
                  key={giveaway.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GiveawayCard giveaway={giveaway} onEnter={handleEnterGiveaway} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Social Media Contests */}
      {contests.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-yellow-700 mb-4">Social Media Contests</h2>
              <p className="text-gray-700 text-lg">Share your Nuta love and win cash prizes!</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {contests.map((contest, index) => (
                <motion.div
                  key={contest.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <SocialContestCard contest={contest} onSubmit={handleSubmitContest} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Don't Miss Out!</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter to get notified about new promotions and exclusive deals.
          </p>
          <Button
            className="bg-white text-primary hover:bg-gray-100 font-bold px-8 py-3 text-lg"
          >
            Subscribe Now
          </Button>
        </div>
      </section>
    </div>
  )
}

export default PromotionsPage

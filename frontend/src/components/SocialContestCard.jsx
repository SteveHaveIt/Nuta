import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, DollarSign, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const SocialContestCard = ({ contest, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tiktokLink: '',
    facebookLink: '',
    twitterLink: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!formData.email || !formData.tiktokLink) return

    setLoading(true)
    try {
      await onSubmit(contest.id, formData)
      setSubmitted(true)
    } catch (error) {
      console.error('Error submitting contest entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const requirements = contest.requirements 
    ? (typeof contest.requirements === 'string' ? JSON.parse(contest.requirements) : contest.requirements)
    : []

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-2 border-yellow-400">
        <CardHeader className="bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="flex items-start justify-between">
            <Trophy className="w-12 h-12 text-yellow-600" />
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{contest.prize} KES</span>
            </div>
          </div>
          <CardTitle className="text-2xl mt-4">{contest.name}</CardTitle>
          <CardDescription>{contest.description}</CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">Requirements:</p>
              <ul className="space-y-2">
                {requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {!submitted ? (
              <div className="space-y-3 pt-4">
                <Input
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Your email *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  placeholder="TikTok post link *"
                  value={formData.tiktokLink}
                  onChange={(e) => setFormData({ ...formData, tiktokLink: e.target.value })}
                />
                <Input
                  placeholder="Facebook post link"
                  value={formData.facebookLink}
                  onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
                />
                <Input
                  placeholder="Twitter/X post link"
                  value={formData.twitterLink}
                  onChange={(e) => setFormData({ ...formData, twitterLink: e.target.value })}
                />
              </div>
            ) : (
              <div className="bg-green-50 border-2 border-green-500 p-6 rounded-lg text-center">
                <Trophy className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-700 font-semibold text-lg">Submission Received!</p>
                <p className="text-sm text-green-600 mt-2">
                  We'll review your entry and notify you soon. Good luck!
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter>
          {!submitted && (
            <Button
              onClick={handleSubmit}
              disabled={!formData.email || !formData.tiktokLink || loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold"
            >
              {loading ? 'Submitting...' : 'Submit Entry'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default SocialContestCard

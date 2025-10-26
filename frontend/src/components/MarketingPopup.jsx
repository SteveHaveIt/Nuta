import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const MarketingPopup = ({ campaign, onClose, onAction }) => {
  if (!campaign) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {campaign.imageUrl && (
            <div className="w-full h-48 overflow-hidden">
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-8">
            {campaign.title && (
              <h3 className="text-2xl font-bold text-primary mb-4">
                {campaign.title}
              </h3>
            )}

            {campaign.message && (
              <p className="text-gray-600 mb-6 leading-relaxed">
                {campaign.message}
              </p>
            )}

            {campaign.ctaText && (
              <Button
                onClick={() => {
                  onAction(campaign)
                  onClose()
                }}
                className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {campaign.ctaText}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MarketingPopup

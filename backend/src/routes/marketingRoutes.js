const express = require('express');
const router = express.Router();
const spinWheelController = require('../controllers/spinWheelController');
const marketingController = require('../controllers/marketingController');
const giveawayController = require('../controllers/giveawayController');
const affiliateController = require('../controllers/affiliateController');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

// Spin Wheel Routes
router.get('/spin-wheel/config', spinWheelController.getSpinWheelConfig);
router.get('/spin-wheel/can-spin', spinWheelController.canUserSpin);
router.post('/spin-wheel/spin', spinWheelController.spin);
router.get('/spin-wheel/history', spinWheelController.getSpinHistory);

// Marketing Campaigns
router.get('/campaigns', marketingController.getActiveCampaigns);
router.post('/campaigns/track', marketingController.trackInteraction);

// Flash Sales
router.get('/flash-sales', marketingController.getActiveFlashSales);

// Discount Codes
router.post('/discount/apply', marketingController.applyDiscountCode);
router.post('/discount/use', authenticateToken, marketingController.recordDiscountUsage);

// Newsletter
router.post('/subscribe', marketingController.subscribe);

// Giveaways
router.get('/giveaways', giveawayController.getActiveGiveaways);
router.post('/giveaways/enter', giveawayController.enterGiveaway);
router.post('/giveaways/pick-winner', authenticateToken, isAdmin, giveawayController.pickWinner);

// Social Media Contests
router.get('/contests', giveawayController.getActiveSocialContests);
router.post('/contests/submit', giveawayController.submitContestEntry);
router.get('/contests/:contestId/submissions', authenticateToken, isAdmin, giveawayController.getContestSubmissions);
router.put('/contests/submissions/:submissionId/verify', authenticateToken, isAdmin, giveawayController.verifySubmission);
router.post('/contests/select-winner', authenticateToken, isAdmin, giveawayController.selectContestWinner);

// Affiliate Program
router.post('/affiliates/register', affiliateController.registerAffiliate);
router.get('/affiliates/code/:code', affiliateController.getAffiliateByCode);
router.get('/affiliates/:affiliateId/dashboard', authenticateToken, affiliateController.getAffiliateDashboard);
router.post('/affiliates/track', affiliateController.trackReferral);
router.get('/affiliates', authenticateToken, isAdmin, affiliateController.getAllAffiliates);
router.put('/affiliates/:affiliateId/status', authenticateToken, isAdmin, affiliateController.updateAffiliateStatus);
router.put('/affiliates/referrals/:referralId/paid', authenticateToken, isAdmin, affiliateController.markCommissionPaid);

module.exports = router;

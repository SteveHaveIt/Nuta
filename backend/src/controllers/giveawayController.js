const db = require('../config/database');

// Get active giveaways
exports.getActiveGiveaways = (req, res) => {
  const now = new Date().toISOString();
  
  db.all(
    `SELECT * FROM giveaways 
     WHERE active = 1 
     AND startDate <= ?
     AND endDate >= ?
     ORDER BY endDate ASC`,
    [now, now],
    (err, giveaways) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ giveaways });
    }
  );
};

// Enter giveaway
exports.enterGiveaway = (req, res) => {
  const { giveawayId, userId, email, phone, entryType } = req.body;

  // Check if already entered
  db.get(
    'SELECT id FROM giveaway_entries WHERE giveawayId = ? AND (userId = ? OR email = ?)',
    [giveawayId, userId, email],
    (err, existing) => {
      if (existing) {
        return res.status(400).json({ error: 'You have already entered this giveaway' });
      }

      db.run(
        'INSERT INTO giveaway_entries (giveawayId, userId, email, phone, entryType) VALUES (?, ?, ?, ?, ?)',
        [giveawayId, userId || null, email, phone, entryType || 'website'],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, message: 'Successfully entered giveaway!' });
        }
      );
    }
  );
};

// Pick random winner (admin only)
exports.pickWinner = (req, res) => {
  const { giveawayId } = req.body;

  // Get all verified entries
  db.all(
    'SELECT * FROM giveaway_entries WHERE giveawayId = ? AND verified = 1',
    [giveawayId],
    (err, entries) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (entries.length === 0) {
        return res.status(400).json({ error: 'No verified entries found' });
      }

      // Pick random winner
      const winner = entries[Math.floor(Math.random() * entries.length)];

      // Update giveaway with winner
      db.run(
        'UPDATE giveaways SET winnerId = ?, drawDate = datetime(\'now\') WHERE id = ?',
        [winner.userId, giveawayId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({ 
            success: true, 
            winner: {
              id: winner.id,
              email: winner.email,
              phone: winner.phone
            }
          });
        }
      );
    }
  );
};

// Get active social media contests
exports.getActiveSocialContests = (req, res) => {
  const now = new Date().toISOString();
  
  db.all(
    `SELECT * FROM social_contests 
     WHERE active = 1 
     AND startDate <= ?
     AND endDate >= ?
     ORDER BY endDate ASC`,
    [now, now],
    (err, contests) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      contests = contests.map(contest => ({
        ...contest,
        requirements: contest.requirements ? JSON.parse(contest.requirements) : []
      }));

      res.json({ contests });
    }
  );
};

// Submit social media contest entry
exports.submitContestEntry = (req, res) => {
  const { 
    contestId, 
    userId, 
    name, 
    email, 
    phone, 
    tiktokLink, 
    facebookLink, 
    twitterLink 
  } = req.body;

  // Check if already submitted
  db.get(
    'SELECT id FROM contest_submissions WHERE contestId = ? AND (userId = ? OR email = ?)',
    [contestId, userId, email],
    (err, existing) => {
      if (existing) {
        return res.status(400).json({ error: 'You have already submitted to this contest' });
      }

      db.run(
        `INSERT INTO contest_submissions 
         (contestId, userId, name, email, phone, tiktokLink, facebookLink, twitterLink)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [contestId, userId || null, name, email, phone, tiktokLink, facebookLink, twitterLink],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }

          res.json({ 
            success: true, 
            message: 'Contest entry submitted successfully! We will review and notify you.' 
          });
        }
      );
    }
  );
};

// Get contest submissions (admin)
exports.getContestSubmissions = (req, res) => {
  const { contestId } = req.params;

  db.all(
    'SELECT * FROM contest_submissions WHERE contestId = ? ORDER BY createdAt DESC',
    [contestId],
    (err, submissions) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ submissions });
    }
  );
};

// Verify contest submission (admin)
exports.verifySubmission = (req, res) => {
  const { submissionId } = req.params;
  const { verified, notes } = req.body;

  db.run(
    'UPDATE contest_submissions SET verified = ?, verificationNotes = ? WHERE id = ?',
    [verified ? 1 : 0, notes, submissionId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true });
    }
  );
};

// Select contest winner (admin)
exports.selectContestWinner = (req, res) => {
  const { contestId, submissionId } = req.body;

  db.get(
    'SELECT userId FROM contest_submissions WHERE id = ?',
    [submissionId],
    (err, submission) => {
      if (err || !submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }

      db.run(
        'UPDATE social_contests SET winnerId = ? WHERE id = ?',
        [submission.userId, contestId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          res.json({ success: true, message: 'Winner selected successfully!' });
        }
      );
    }
  );
};

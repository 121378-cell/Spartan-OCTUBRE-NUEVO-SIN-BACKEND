const express = require('express');
const router = express.Router();
const db = require('../database');

/**
 * @route   POST /plan/asignar
 * @desc    Assign a new plan to a user.
 * @access  Public
 */
router.post('/asignar', (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'user_id is required.' });
  }

  try {
    const stmt = db.prepare('INSERT INTO plans (user_id) VALUES (?)');
    const info = stmt.run(user_id);
    res.status(201).json({
      success: true,
      message: 'Plan assigned successfully.',
      plan_id: info.lastInsertRowid
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error.', details: error.message });
  }
});

/**
 * @route   POST /plan/compromiso
 * @desc    Commit to a specific plan.
 * @access  Public
 */
router.post('/compromiso', (req, res) => {
  const { plan_id } = req.body;

  if (!plan_id) {
    return res.status(400).json({ error: 'plan_id is required.' });
  }

  try {
    const stmt = db.prepare('UPDATE plans SET committed = 1 WHERE id = ?');
    const info = stmt.run(plan_id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    res.json({ success: true, message: 'Plan commitment recorded successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Database error.', details: error.message });
  }
});

module.exports = router;
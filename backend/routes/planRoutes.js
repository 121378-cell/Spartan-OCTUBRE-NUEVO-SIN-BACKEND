const express = require('express');
const router = express.Router();
const db = require('../database');

// --- Endpoint to create a new plan or schedule an existing one ---
router.post('/asignar', (req, res) => {
  const { user_id, plan_id } = req.body;
  let current_plan_id = plan_id;

  // If no plan_id is provided, create a new plan
  if (!current_plan_id) {
    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required to create a new plan.' });
    }
    try {
      const stmt = db.prepare('INSERT INTO plans (user_id) VALUES (?)');
      const info = stmt.run(user_id);
      current_plan_id = info.lastInsertRowid;
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create plan record.', details: error.message });
    }
  }

  // --- Scheduling Logic ---
  // Fetch the plan to get committed days
  const plan = db.prepare('SELECT * FROM plans WHERE id = ?').get(current_plan_id);

  if (!plan || !plan.committed_days) {
    // If no committed days, just confirm plan creation. Scheduling can happen after commitment.
    return res.status(201).json({
      success: true,
      message: 'Plan created but not yet scheduled. Please commit to days first.',
      plan_id: current_plan_id,
      partitura_semanal: {}
    });
  }

  const committedDays = JSON.parse(plan.committed_days);
  const partitura_semanal = {};
  const dayMap = { "Lunes": 0, "Martes": 1, "Miércoles": 2, "Jueves": 3, "Viernes": 4, "Sábado": 5, "Domingo": 6 };

  // Sort days to ensure logical processing
  committedDays.sort((a, b) => dayMap[a] - dayMap[b]);

  let lastWorkoutDayIndex = -10; // Initialize to a value that allows the first day to be scheduled

  for (const day of committedDays) {
    const currentDayIndex = dayMap[day];
    // Check for 48-hour rule (at least 1 rest day in between)
    if (currentDayIndex > lastWorkoutDayIndex + 1) {
      partitura_semanal[day] = "Fuerza"; // Assign a workout
      lastWorkoutDayIndex = currentDayIndex;
    } else {
       partitura_semanal[day] = "Descanso"; // Enforce rest day
    }
  }

  res.status(201).json({
    success: true,
    message: 'Plan assigned and scheduled successfully.',
    plan_id: plan_id,
    partitura_semanal: partitura_semanal
  });
});


// --- Endpoint to commit to days and update a plan ---
router.post('/compromiso', (req, res) => {
  const { plan_id, dias_comprometidos } = req.body;

  if (!plan_id || !dias_comprometidos || !Array.isArray(dias_comprometidos)) {
    return res.status(400).json({ error: 'plan_id and a dias_comprometidos array are required.' });
  }

  try {
    const committed_days_json = JSON.stringify(dias_comprometidos);
    const stmt = db.prepare('UPDATE plans SET committed = 1, committed_days = ? WHERE id = ?');
    const info = stmt.run(committed_days_json, plan_id);

    if (info.changes === 0) {
      return res.status(404).json({ error: 'Plan not found.' });
    }

    res.json({ success: true, message: 'Plan commitment recorded successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Database error.', details: error.message });
  }
});

module.exports = router;
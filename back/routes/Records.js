const express = require("express");
const router = express.Router();
const { records } = require("../models");

router.get("/", async (req, res) => {
    const listOfRecords = await records.findAll();
    res.json(listOfRecords);
});

router.post('/', async (req, res) => {
  try {
    const record = await records.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
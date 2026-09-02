const express = require("express");
const router = express.Router();
const { records } = require("../models");
const auth = require("../middleware/auth");
const csrf = require("../middleware/csrf");

router.get("/", auth, async (req, res) => {
    const listOfRecords = await records.findAll();
    return res.json(listOfRecords);
});

router.post('/', auth, csrf, async (req, res) => {
  
  try {
    
    const record = await records.create(req.body);
    return res.status(201).json(record);

  } catch (error) {
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ errors: validationErrors });
    }

    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

router.put("/:id", auth, csrf, async (req, res) => {
  
  try {
    
    const { id } = req.params;

    const [affectedCount] = await records.update(req.body, { where: { id } });
    
    if (affectedCount === 0) {
      return res.status(404).json({ error: `Record with id ${id} not found` });
    }

    const updatedRecord = await records.findByPk(id);

    return res.status(200).json({ message: "Record updated successfully", record: updatedRecord });

  } catch (error) {
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message);
      return res.status(400).json({ errors: validationErrors });
    }
    
    console.error(error);
    return res.status(500).json({ error: "Server error" });

  }
});

router.delete("/:id", auth, csrf, async (req, res) => {

  try {

    const { id } = req.params;
    
    const affectedCount = await records.destroy({ where: { id }});

    if (affectedCount === 0) {
      return res.status(404).json({ error: `Record with id ${id} not found` });
    }

    return res.status(200).json({ message: "Record deleted successfully" });

  } catch (error) {

    console.error(error);
    return res.status(500).json({ error: "Server error" });
    
  }
});


module.exports = router;
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
    return res.status(500).send("Server error");
  }
});

router.put("/:id", auth, csrf, async (req, res) => {
  try {
    const { id } = req.params;
    await records.update(req.body, { where: { id } });
    return res.json({ message: "Record updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", auth, csrf, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await records.destroy({ where: { id }});

    if(result) {
      return res.status(200).send(`Task with id ${id} deleted.`);
    } else {
      return res.status(404).send(`Task with id ${id} could not be deleted`);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error");
  }
});


module.exports = router;
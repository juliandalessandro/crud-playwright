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
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await records.update(req.body, { where: { id } });
    res.json({ message: "Record updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await records.destroy({ where: { id }});

    if(result) {
      res.status(200).send(`Task with id ${id} deleted.`);
    } else {
      res.status(404).send(`Task with id ${id} could not be deleted`);
    }
  } catch {
    console.error(error);
    res.status(500).send("Server error");
  }
});


module.exports = router;
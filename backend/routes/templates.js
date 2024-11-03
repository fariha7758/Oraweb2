// backend/routes/templates.js
const express = require('express');
const router = express.Router();
const Template = require('../models/Template'); // Assuming Template is a Mongoose model
const mongoose = require('mongoose');

// Save template
router.post('/', async (req, res) => {
  try {
    const template = new Template(req.body);
    await template.save();
    res.status(201).json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save template' });
  }
});

// Get a template by ID
router.get('/:id', async (req, res) => {
    try {
      const template = await Template.findById(req.params.id);
      if (!template) {
        return res.status(404).json({ error: 'Template not found' });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: 'Failed to load template' });
    }
  });

// Load all template
router.get('/', async (req, res) => {
  try {
    const template = await Template.find();
    res.json(template);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load template' });
  }
});

// Delete a template by ID
router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      console.log('Received ID for deletion:', id); // Log the incoming ID
  
      // Convert to ObjectId (if necessary)
      const objectId =  new mongoose.Types.ObjectId(id);
      console.log('Converted ObjectId:', objectId); // Log the converted ObjectId
  
      // Attempt to delete the template using the converted ObjectId
      const deletedTemplate = await Template.findByIdAndDelete(objectId);
      if (!deletedTemplate) {
        console.log('Template not found for ID:', objectId);
        return res.status(404).json({ error: 'Template not found' });
      }
  
      console.log('Template deleted successfully:', deletedTemplate);
      res.json({ message: 'Template deleted successfully' });
    } catch (error) {
      console.error('Error deleting template:', error); // Log the full error
      res.status(500).json({ error: 'Failed to delete template' });
    }
  });

module.exports = router;

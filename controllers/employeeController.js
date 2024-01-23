const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');

router.get('/', (req, res) => {
  res.render("employee/addOrEdit", { viewTitle: "Insert Employee" });
});

router.post('/', async (req, res) => {
  if (req.body._id == '') {
    try {
      await insertRecord(req, res);
    } catch (err) {
      console.error('Error during record insertion:', err);
      res.status(err.status || 500).send("Internal Server Error");
    }
  } else {
    try {
      await updateRecord(req, res);
    } catch (err) {
      console.error('Error during record update:', err);
      res.status(err.status || 500).send("Internal Server Error");
    }
  }
});

async function insertRecord(req, res) {
  try {
    const employee = new Employee({
      fullName: req.body.fullName,
      email: req.body.email,
      mobile: req.body.mobile,
      city: req.body.city
    });

    await employee.validate(); // Trigger validation manually
    await employee.save();
    res.redirect('employee/list');
  } catch (err) {
    if (err.name === 'ValidationError') {
      // Handle validation error
      console.error('Validation error during record insertion:', err);
      res.status(400).render("employee/addOrEdit", {
        viewTitle: 'Insert Employee',
        employee: req.body,
        validationError: err.message // Pass the validation error message to the view
      });
    } else {
      // Handle other errors
      console.error('Error during record insertion:', err);
      res.status(500).send("Internal Server Error");
    }
  }
}

async function updateRecord(req, res) {
  try {
    const doc = await Employee.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }).exec();
    if (doc) {
      res.redirect('employee/list');
    } else {
      const err = new Error('Employee not found');
      err.status = 404;
      throw err;
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      handleValidationError(err, req.body);
      res.render("employee/addOrEdit", {
        viewTitle: 'Update Employee',
        employee: req.body
      });
    } else {
      throw err;
    }
  }
}

router.get('/list', async (req, res) => {
  try {
    const docs = await Employee.find();
    res.render("employee/list", { list: docs });
  } catch (err) {
    console.error('Error in retrieving employee list:', err);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doc = await Employee.findById(req.params.id).exec();
    if (doc) {
      res.render("employee/addOrEdit", {
        viewTitle: "Update Employee",
        employee: doc
      });
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (err) {
    console.error('Error retrieving employee by ID:', err);
    res.status(500).send("Internal Server Error");
  }
});

router.get('/delete/:id', async (req, res) => {
  try {
    const doc = await Employee.findByIdAndDelete(req.params.id).exec();
    if (doc) {
      res.redirect('/employee/list');
    } else {
      res.status(404).send("Employee not found");
    }
  } catch (err) {
    console.error('Error in employee delete:', err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;

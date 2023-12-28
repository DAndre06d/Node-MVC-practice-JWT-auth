const express = require('express');
const router = express.Router();
const path = require('path');
const employesController = require("../../controllers/employeesController")

router
  .route('/')
  .get(employesController.getAllEmployees)
  .post(employesController.createNewEmployee)
  .put(employesController.updateEmployee)
  .delete(employesController.deleteEmployee);

router.route('/:id').get( employesController.getEmployee);
module.exports = router;

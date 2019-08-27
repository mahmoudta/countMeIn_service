const express = require('express'),
	router = require('express-promise-router')();
const catCtl = require('../controllers/cats.ctl');

router.route('/').post(catCtl.createCategory).get(catCtl.getAllCategories).put(catCtl.updateCategory);
router.route('/:id').delete(catCtl.deleteCategory);
router.route('/service').post(catCtl.addService).put(catCtl.updateService);
router.route('/service/:id').delete(catCtl.deleteService);

module.exports = router;

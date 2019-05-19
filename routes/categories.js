const express = require('express'),
	router = require('express-promise-router')();
const catCtl = require('../controllers/cats.ctl');

router.route('/').post(catCtl.createCategory).get(catCtl.getAllCategories);
router.route('/:id').delete(catCtl.deleteCategory);
router.route('/service').post(catCtl.addService);
router.route('/services/:id').delete(catCtl.deleteService);

module.exports = router;

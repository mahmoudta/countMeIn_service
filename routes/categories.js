const express = require('express'),
	router = require('express-promise-router')();
const catCtl = require('../controllers/cats.ctl');

router.route('/').post(catCtl.createCategory).get(catCtl.getAllCategories);
router.route('/:id').delete(catCtl.deleteCategory);
router.route('/sub-category').post(catCtl.addSubCategory);

module.exports = router;

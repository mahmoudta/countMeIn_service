const express = require('express'),
	router = require('express-promise-router')();
const catCtl = require('../controllers/cats.ctl');

router.route('/Categories').post(catCtl.createCategory).get(catCtl.getAllCategories);
// router.route('/:id').get(catCtl.getCategoryById).delete(catCtl.deleteCategory).put(catCtl.updateCategory);

module.exports = router;

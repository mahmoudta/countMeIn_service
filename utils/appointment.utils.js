const isEmpty = require('lodash/isEmpty');

module.exports = {
	getServices: async (categories, services_ids) => {
		var services = [];
		categories.map((category) => {
			category.services.find(async (service) => {
				const index = services_ids.indexOf(service._id);
				if (index != -1) {
					await services.push({ _id: service._id, name: service.name });
				}
			});
		});
		return await services;
	}
};

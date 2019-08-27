const isEmpty = require('lodash/isEmpty');

module.exports = {
	getFullserviceData : async (categories, services) => {
		let finalServices = [];
		const selectedservices = await categories.map((category) => {
			return category.services.map((service) => {
				return services.map((businessService) => {
					if (businessService.service_id.toString() === service._id.toString()) {
						return finalServices.push({
							_id   : service._id,
							title : service.title,
							cost  : businessService.cost,
							time  : businessService.time
						});
					}
				});
			});
		});

		return await finalServices;
	}
};

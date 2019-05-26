const isEmpty = require('lodash/isEmpty');

module.exports = {
	getFullserviceData: async (categories, services) => {
		// console.log('getFullserviceData');
		// console.log(categories);
		let finalServices = [];
		const selectedservices = await categories.map((category) => {
			// console.log(`category now: ${category.name}`);
			return category.services.map((service) => {
				// console.log(`service now: ${service._id} : is a category service`);
				return services.map((businessService) => {
					// console.log(`service now: ${businessService.service_id} : is a selected service`);
					if (businessService.service_id.toString() === service._id.toString()) {
						console.log(`title:${service.title},cost:${businessService.cost}`);
						return finalServices.push({
							_id: service._id,
							title: service.title,
							cost: businessService.cost,
							time: businessService.time
						});
					}
				});
			});
		});

		// console.log(finalServices);
		return await finalServices;
	}
};

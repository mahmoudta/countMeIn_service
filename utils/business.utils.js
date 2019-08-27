const isEmpty = require('lodash/isEmpty');

module.exports = {
	getFollowers: async (customers) => {
		const followers = await customers.filter((customer) => {
			return customer.isFollower;
		});

		return await followers;
	},

	isUserFollower: async (followers, user_id) => {
		// const followers = await getFollowers(customers);
		const user = await followers.find((follower) => {
			follower.customer_id.toString() === user_id.toString();
		});
		if (!isEmpty(user)) return true;

		return false;
	},

	getCustomer: async (customers, user_id) => {
		const customer = await customers.filter((customerTemp) => {
			return customerTemp.customer_id.toString() === user_id.toString();
		});

		if (!isEmpty(customer)) return customer[0];

		return {};
	}
};

const JWT = require("jsonwebtoken");
const Businesses = require("../models/business");
const Categories = require("../models/category");
const Users = require("../models/user");
const {
  getFollowers,
  isUserFollower,
  getCustomer
} = require("../utils/business.utils");
const isEmpty = require("lodash/isEmpty");

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');
createTime = async time => {
  try {
    let splitter = time.split(":");
    let date = new Date();
    date.setHours(Number(splitter[0]), Number(splitter[1]));
    // console.log(`date: ${date}`);
    return await date;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBusiness: async (req, res, next) => {
    console.log("create Business called!!");
    // get all params
    const { name, category, img, working, break_time, services } = req.body;
    // checking if user already have a business
    const business = await Businesses.findOne({ owner_id: req.user._id });
    if (business) {
      return res
        .status(403)
        .json({ error: "you already have a business page" });
    }

    // if  category is not a real category
    const isCat = await Categories.findById(category, "name");
    // if not => return error
    if (!isCat) return res.status(404).json({ error: "inValid Category" });

    /* convert request working hours to real date object  */
    var items = [];
    const fillTime = async () => {
      for (const element of working) {
        const from = await createTime(element.from);
        const until = await createTime(element.until);
        await items.push({
          day: element.day,
          opened: element.opened,
          from: from,
          until: until
        });
      }
      return await items;
    };

    /* splitting the */

    const newBusiness = new Businesses({
      owner_id: req.user._id,
      profile: {
        name: name,
        category_id: category,
        purposes: services,
        working_hours: await fillTime(),
        break_time: break_time
      }
    });
    await newBusiness.save();
    res.status(200).json({ success: "bussiness successfully created" });
  },

  getAllBusinesses: async (req, res, next) => {
    const businesses = await Businesses.find({});
    if (!businesses) return res.status(404).json({ error: "not found" });
    res.status(200).json({ businesses });
  },

  // getBusinessForView: async (req, res, next) => {
  // 	const id = req.params.id;
  // 	const business = await Businesses.findById(id);
  // 	if (!business) return res.status(404).json({ error: 'Business invalid' });
  // 	res.status(200).json({ business });
  // },

  getBusinessForView: async (req, res, next) => {
    console.log("business for view");
    const id = req.params.id;
    const Reqbusiness = await Businesses.findById(id);

    if (!Reqbusiness)
      return res.status(404).json({ error: "Business Not Found" });

    const followers = await getFollowers(Reqbusiness.customers);
    const isFollower = await isUserFollower(followers, req.user._id);

    // const isUserFollower = await isUserFollower(followers, req.user._id);
    const business = {
      _id: id,
      owner_id: Reqbusiness.owner_id,
      profile: Reqbusiness.profile,
      followers: followers.length,
      isFollower: isFollower
    };

    res.status(200).json({ business });
  },

  getBusinessByOwner: async (req, res, next) => {
    const owner_id = req.params.owner_id;
    const business = await Businesses.findOne({ owner_id: owner_id });
    if (!business) return res.status(404).json({ error: "Business invalid" });

    res.status(200).json({ business });
  },

  editBusiness: async (req, res, next) => {
    console.log("edit Business Called!");
    //get id

    // get all request params

    //
  },
  followBusiness: async (req, res, next) => {
    console.log("follow business");
    const { business_id } = req.body;

    // check if business
    const business = await Businesses.findById(business_id);
    if (!business) return res.status(404).json({ error: "Business Not Found" });

    // check if user already following this business

    const customer = await getCustomer(business.customers, req.user._id);
    let updated_business;
    if (!isEmpty(customer)) {
      if (customer.isFollower)
        return res.status(201).json({ error: "user already follower" });
      const update = {
        $set: {
          "customers.$.isFollower": true
        }
      };
      updated_business = await Businesses.findOneAndUpdate(
        { _id: business_id, "customers.customer_id": req.user._id },
        update
      );
    } else {
      const update = {
        $push: {
          customers: {
            customer_id: req.user._id,
            isFollower: true
          }
        }
      };
      /* push user id to business */
      updated_business = await Businesses.findByIdAndUpdate(
        business_id,
        update
      );
    }

    //push the business id to users array
    if (!updated_business)
      return res.status(202).json({ error: "Some Error Occured" });
    const userUpdate = {
      $push: {
        following: business_id
      }
    };

    /* push business id to business */
    const updated_user = await Users.findByIdAndUpdate(
      req.user._id,
      userUpdate
    );

    // if (!updated_business) return res.status(404).json({ error: 'an error occurred' });

    res.status(200).json({ isFollower: true });
  },

  unfollowBusiness: async (req, res, next) => {
    const { business_id } = req.body;
    // check if business
    const business = await Businesses.findById(business_id);
    if (!business) return res.status(404).json({ error: "business Not Found" });

    //unfollow
    const update = {
      $set: {
        "customers.$.isFollower": false
      }
    };

    const userUpdate = {
      $pull: {
        following: business_id
      }
    };
    /* push user id to business */
    const updated_business = await Businesses.findOneAndUpdate(
      { _id: business_id, "customers.customer_id": req.user._id },
      update
    );

    if (!updated_business)
      return res.status(403).json({ error: "an error occurred" });

    /* push business id to business */
    const updated_user = await Users.findOneAndUpdate(
      { _id: req.user._id },
      userUpdate
    );

    res.status(200).json({ isFollower: false });
  },
  getAllCustomers: async (req, res, next) => {
    const business = await Businesses.findOne(
      { owner_id: req.user._id },
      "customers.customer_id"
    );
    if (!business) return res.status(404).json({ error: "business not found" });
    const ids = await business.customers.map(customer => {
      return customer.customer_id;
    });

    const customers = await Users.find({ _id: { $in: ids } }, "profile.name");

    if (!customers) return res.status(404).json({ error: "an error occurred" });

    res.status(200).json({ customers });
  },
  getServicesByBusiness: async (req, res, next) => {
    const { id } = req.params;
    const business = await Businesses.findById(id);
    if (!business) return res.status(404).json({ error: "business not found" });
    const ids = await business.profile.services.map(service => {
      return service.service_id;
    });
    console.log(ids);
    const category = await Categories.findById(business.profile.category_id);

    const services = await category.subCats.filter(elem => {
      return ids.includes(elem._id.toString());
    });

    if (!services) return res.status(404).json({ error: "an error occurred" });
    res.status(200).json({ services });
  },
  getBusinessesByCatagory: async (req, res, next) => {
    const { catagoryId } = req.params;
    //var catagoryId = JSON.parse(req.params);

    console.log(catagoryId);

    const ResultQuery = await Businesses.find(
      {
        "profile.category_id": catagoryId
      },
      "_id"
    );

    res.status(200).json({ ResultQuery });
  }
};

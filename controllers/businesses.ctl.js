const JWT = require("jsonwebtoken");
const Businesses = require("../models/business");
const Categories = require("../models/category");
const Services = require("../models/service");
const Users = require("../models/user");
const {
  getFollowers,
  isUserFollower,
  getCustomer
} = require("../utils/business.utils");
const { getFullserviceData } = require("../utils/categories.utils");
const isEmpty = require("lodash/isEmpty");
const { signInToken } = require("./users.ctl");
const mongoose = require("mongoose");

// const {freeTimeAlg} = require('./algs/free-alg/freeTimeAlg');
createTime = async time => {
  try {
    let splitter = time.split(":");
    let date = new Date();
    date.setHours(Number(splitter[0]), Number(splitter[1]), 0);
    return await date;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createBusiness: async (req, res, next) => {
    console.log("create Business called!!");
    // get all params
    const {
      street,
      city,
      building,
      postal_code,
      breakTime,
      categories,
      description,
      name,
      img,
      phone,
      working,
      services
    } = req.body;
    // checking if user already have a business
    const Qbusiness = await Businesses.findOne({ owner_id: req.user._id });
    if (Qbusiness) {
      return res.status(403).json({ error: "you already have a business" });
    }

    //TODO
    // if  category is not a real category
    // const isCat = await Categories.find(category, 'name');
    // if not => return error
    // if (!isCat) return res.status(404).json({ error: 'inValid Category' });

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
          until: until,
          break: {
            isBreak: element.break.isBreak ? true : false,
            from: await createTime(element.break.from),
            until: await createTime(element.break.until)
          }
        });
      }
      return await items;
    };

    /* splitting the categories and the services */
    const NewCategories = await categories.map(category => {
      return mongoose.Types.ObjectId(category.value);
    });
    const NewServices = await services.map(service => {
      return {
        service_id: mongoose.Types.ObjectId(service.value),
        time: Number(service.time),
        cost: Number(service.cost)
      };
    });
    const newBusiness = new Businesses({
      _id: new mongoose.Types.ObjectId(),
      owner_id: mongoose.Types.ObjectId(req.user._id),
      profile: {
        name: name,
        img: !isEmpty(img) ? img : "",
        location: {
          street: !isEmpty(street) ? street : "",
          city: !isEmpty(city) ? city : "",
          building: !isEmpty(building) ? Number(building) : 0,
          postal_code: !isEmpty(postal_code) ? Number(postal_code) : 0
        },
        phone: phone,
        description: !isEmpty(description) ? description : ""
      },
      services: NewServices,
      categories: NewCategories,
      working_hours: await fillTime(),
      break_time: !isEmpty(breakTime) ? breakTime : 10
    });
    const business = await newBusiness.save();
    if (!business)
      return res
        .status(403)
        .json({ error: "some error accourd during create" });
    const businessNew = await Businesses.findById(business._id)
      .populate("services.service_id", "title")
      .populate("categories", "name")
      .exec();
    // const token = signInToken(req.user, business._id);
    // business.profile.services = [];
    res.status(200).json({ businessNew });
  },

  getAllBusinesses: async (req, res, next) => {
    const businesses = await Businesses.find({});
    if (!businesses) return res.status(404).json({ error: "not found" });
    res.status(200).json({ businesses });
  },

  getBusinessForView: async (req, res, next) => {
    console.log("business for view");
    const id = mongoose.Types.ObjectId(req.params.id);
    const user_id = req.user.id;
    console.log(req.user.id);
    const business = await Businesses.findById(id)
      .populate("services.service_id", "title")
      .populate("categories", "name")
      .lean();
    const follower = await business.customers.find(
      async customer => (await customer.customer_id) == req.user.id
    );
    const followers = await business.customers.filter(async customer => {
      return await customer.isFollower;
    });

    business["isFollower"] = await follower.isFollower;
    business["followers"] = await followers.length;

    if (!business) res.status(404).json({ error: "business not found" });

    res.status(200).json({ business });
  },

  getBusinessByOwner: async (req, res, next) => {
    const owner_id = req.params.owner_id;
    const business = await Businesses.findOne({ owner_id: owner_id })
      .populate("categories", "name")
      .populate("services.service_id", "title")
      .populate("customers.customer_id", "profile");
    if (!business) return res.status(404).json({ error: "Business Not Found" });

    res.status(200).json({ business });
  },

  editBusiness: async (req, res, next) => {
    console.log("edit Business Called!");
    const {
      business_id,
      street,
      city,
      building,
      postal_code,
      breakTime,
      categories,
      description,
      name,
      img,
      phone,
      working,
      services
    } = req.body;
    // checking if user already have a business
    // const Qbusiness = await Businesses.findOne({ owner_id: req.user._id });
    // if (Qbusiness) {
    // 	return res.status(403).json({ error: 'you already have a business' });
    // }

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
          until: until,
          break: {
            isBreak: element.break.isBreak ? true : false,
            from: await createTime(element.break.from),
            until: await createTime(element.break.until)
          }
        });
      }
      return await items;
    };

    /* splitting the categories and the services */

    const NewCategories = await categories.map(category => {
      return category.value;
    });

    const NewServices = await services.map(service => {
      return {
        service_id: service.value,
        time: Number(service.time),
        cost: Number(service.cost)
      };
    });
    const updateBusiness = {
      profile: {
        name: name,
        img: !isEmpty(img) ? img : "",
        location: {
          street: !isEmpty(street) ? street : "",
          city: !isEmpty(city) ? city : "",
          building: !isEmpty(building) ? Number(building) : 0,
          postal_code: !isEmpty(postal_code) ? Number(postal_code) : 0
        },
        phone: phone,
        description: !isEmpty(description) ? description : ""
      },
      services: NewServices,
      category_id: NewCategories,
      working_hours: await fillTime(),
      break_time: !isEmpty(breakTime) ? breakTime : 10
    };

    let business = await Businesses.findOneAndUpdate(
      { _id: business_id },
      updateBusiness
    );
    if (!business)
      return res
        .status(403)
        .json({ error: "some error accourd during update" });
    // business.profile.services = [];
    return res.status(200).json({ business });
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
            customer_id: mongoose.Types.ObjectId(req.user._id),
            isFollower: true
          }
        }
      };
      /* push user id to business */
      updated_business = await Businesses.findOneAndUpdate(business_id, update);
    }

    //push the business id to users array
    if (!updated_business)
      return res.status(202).json({ error: "Some Error Occured" });
    const userUpdate = {
      $push: {
        following: mongoose.Types.ObjectId(business_id)
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

    const business = await Businesses.find(
      {
        categories: mongoose.Types.ObjectId(catagoryId)
      },
      "profile"
    );

    res.status(200).json({ business });
  },
  setfull: async (req, res, next) => {
    const users = await Categories.aggregate([
      {
        $group: {
          _id: "$services",
          services: { $sum: 1 }
        }
      }
    ]);
    res.json({ users });
  }
};

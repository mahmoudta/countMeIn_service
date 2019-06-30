const express = require('express');
let app = new express();
var FreeTime = require('../../models/freeTime');
var Business = require('../../models/business');
var Appointment = require('../../models/appointment');
var User = require('../../models/user');
const util = require('util');
var inherits = require('util').inherits;
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const moment = require('moment');

/***********************************************************************************/
// Node class
class Node {
	constructor(data) {
		this.data = data;
		this.left = null;
		this.right = null;
	}
}
/***********************************************************************************/
// Binary Search tree class
class BinarySearchTree {
	constructor() {
		// root of a binary seach tree
		this.root = null;
		this.tmp_array = [];
		this.length = 0;
	}

	// helper method which creates a new node to
	// be inserted and calls insertNode
	insert(data) {
		// Creating a node and initailising
		// with data
		var newNode = new Node(data);

		// root is null then node will
		// be added to the tree and made root.
		if (this.root === null) {
			this.root = newNode;
			this.length = 1;
		} else {
			// find the correct position in the
			// tree and add the node
			this.insertNode(this.root, newNode);
			this.length++;
		}
		return true;
	}

	// Method to insert a node in a tree
	// it moves over the tree to find the location
	// to insert a node with a given data
	insertNode(node, newNode) {
		// if the data is less than the node
		// data move left of the tree
		if (
			newNode.data.end().hour() < node.data.start().hour() ||
			(newNode.data.end().hour() == node.data.start().hour() &&
				newNode.data.end().minute() >= node.data.start().minute())
		) {
			if (
				newNode.data.end().hour() == node.data.start().hour() &&
				newNode.data.end().minute() == node.data.start().minute()
			) {
				node.data._start._hour = newNode.data.start().hour();
				node.data._start._minute = newNode.data.start().minute();
			} else if (node.left === null) {
				// if left is null insert node here
				node.left = newNode;
			} else {
				// if left is not null recurr until
				// null is found
				this.insertNode(node.left, newNode);
			}
		} else {
			// if the data is more than the node
			// data move right of the tree
			if (
				newNode.data.start().hour() == node.data.end().hour() &&
				newNode.data.start().minute() == node.data.end().minute()
			) {
				node.data._end._hour = newNode.data.end().hour();
				node.data._end._minute = newNode.data.end().minute();
			} else if (node.right === null) {
				// if right is null insert node here
				node.right = newNode;
			} else {
				// if right is not null recurr until
				// null is found
				this.insertNode(node.right, newNode);
			}
		}
	}
	// helper method that calls the
	// removeNode with a given data
	remove(data) {
		// root is re-initialized with
		// root of a modified tree.
		//console.log(data)
		this.root = this.removeNode(this.root, data);
		this.length--;
		return true;
	}

	// Method to remove node with a
	// given data
	// it recurrs over the tree to find the
	// data and removes it
	removeNode(node, key) {
		// if the root is null then tree is
		// empty
		if (node === null) {
			return null;
		} else if (
			key.end().hour() == node.data.end().hour() &&
			key.end().minute() == node.data.end().minute() &&
			(key.start().hour() == node.data.start().hour() && key.start().minute() == node.data.start().minute())
		) {
			// if data is similar to the root's data
			// then delete this node
			// deleting node with no children
			if (node.left === null && node.right === null) {
				node = null;
				return node;
			}

			// deleting node with one children
			if (node.left === null) {
				node = node.right;
				return node;
			} else if (node.right === null) {
				node = node.left;
				return node;
			}

			// Deleting node with two children
			// minumum node of the rigt subtree
			// is stored in aux
			var aux = this.findMinNode(node.right);
			node.data = aux.data;

			node.right = this.removeNode(node.right, aux.data);
			return node;
		} else if (
			key.end().hour() < node.data.start().hour() ||
			(key.end().hour() == node.data.start().hour() && key.end().minute() <= node.data.start().minute())
		) {
			// if data to be delete is lesser than
			// roots data then move to left subtree
			node.left = this.removeNode(node.left, key);
			return node;
		} else if (
			key.start().hour() > node.data.end().hour() ||
			(key.start().hour() == node.data.end().hour() && key.start().minute() >= node.data.end().minute())
		) {
			// if data to be delete is greater than
			// roots data then move to right subtree
			node.right = this.removeNode(node.right, key);
			return node;
		} else {
			console.log('error in remove');
		}
	}

	//  finds the minimum node in tree
	// searching starts from given node
	findMinNode(node) {
		// if left of a node is null
		// then it must be minimum node
		if (node.left === null) {
			return node;
		} else {
			return this.findMinNode(node.left);
		}
	}
	//return array of strings
	arrayofopjects() {
		this.tmp_array = [];
		this.inorder(this.root, 1);
		return this.tmp_array;
	}
	//return array of time_range opjects
	arrayofstrings() {
		this.tmp_array = [];
		this.inorder(this.root, 0);
		return this.tmp_array;
	}
	//choice =0 when we want to save the tree as array of strings
	//choice =1 when we want to save the tree as array of time_range opjects
	inorder(node, choice) {
		if (node !== null) {
			this.inorder(node.left, choice);
			if (choice == 0) this.tmp_array.push(node.data.string());
			if (choice == 1) this.tmp_array.push(node.data);
			this.inorder(node.right, choice);
		}
	}
	totree(arr) {
		this.root = null;
		this.tmp_array = [];
		this.length = 0;
		arr.forEach((timerange) => {
			this.insert(timerange);
		});
	}
	getlength() {
		return this.length;
	}
	getRootNode() {
		return this.root;
	}
	search(node, data) {
		// if trees is empty return null
		if (node === null) {
			return null;
		} else if (
			key.end().hour() == node.data.end().hour() &&
			key.end().minute() == node.data.end().minute() &&
			(key.start().hour() == node.data.start().hour() && key.start().minute() == node.data.start().minute())
		) {
			// if data is equal to the node data
			// return node
			return node;
		} else if (
			key.end().hour() < node.data.start().hour() ||
			(key.end().hour() == node.data.start().hour() && key.end().minute() <= node.data.start().minute())
		) {
			// if data is less than node's data
			// move left
			return this.search(node.left, data);
		} else if (
			key.start().hour() > node.data.end().hour() ||
			(key.start().hour() == node.data.end().hour() && key.start().minute() >= node.data.end().minute())
		) {
			// if data is greater than node's data
			// move right
			return this.search(node.right, data);
		}
	}
	//check if the time range can be booked
	ifcanbook(timerange, length, minutes_between_appointment) {
		var timetobook;
		timetobook = length + minutes_between_appointment;
		if (timerange.tominutes() >= timetobook) return true;
		else return false;
	}
	//check if this timerange is within another timerange and book it
	ifinthetimerange(timerange, timerange_to_book) {
		if (
			timerange.start().hour() < timerange_to_book.start().hour() ||
			(timerange.start().hour() == timerange_to_book.start().hour() &&
				timerange.start().minute() <= timerange_to_book.start().minute())
		) {
			if (
				timerange.end().hour() > timerange_to_book.end().hour() ||
				(timerange.end().hour() == timerange_to_book.end().hour() &&
					timerange.end().minute() >= timerange_to_book.end().minute())
			) {
				return true;
			}
		}
		return false;
	}
	//return the time ranges the can bee booked
	timerangesthatfit(length, minutes_between_appointment) {
		var can_book = [];
		var free = [];
		free = this.arrayofopjects();

		free.forEach((timerange) => {
			if (this.ifcanbook(timerange, length, minutes_between_appointment)) {
				can_book.push(timerange);
			}
		});

		return can_book;
	}
	//book
	book(timerange_to_book) {
		//console.log("\nbook this\n");
		//console.log(timerange_to_book);
		var checker = 0;
		var free = [];
		var lefttimerange;
		var righttimerange;
		free = this.arrayofopjects();
		//console.log("free",free)
		free.forEach((timerange) => {
			if (this.ifinthetimerange(timerange, timerange_to_book)) {
				this.remove(timerange);
				lefttimerange = new time_range(timerange.start(), timerange_to_book.start());
				righttimerange = new time_range(timerange_to_book.end(), timerange.end());

				if (righttimerange.tominutes() > 0) {
					if (lefttimerange.tominutes() > 0) {
						//a
						this.insert(lefttimerange);
						this.insert(righttimerange);
						checker = 1;
					} else {
						//b
						this.insert(righttimerange);
						checker = 1;
					}
				} else {
					if (lefttimerange.tominutes() > 0) {
						//c
						this.insert(lefttimerange);
						checker = 1;
					} else {
						//d
						checker = 1;
					}
				}
			}
		});
		if (checker == 1) return true;
		else return false;
	}
}
/***********************************************************************************/
//time_range opject
var time = function(hour, minute) {
	this._hour = hour;
	this._minute = minute;
};
time.prototype.hour = function() {
	return this._hour;
};
time.prototype.minute = function() {
	return this._minute;
};
time.prototype.string = function() {
	if (this._minute > 9) return this._hour + ':' + this._minute;
	else return this._hour + ':' + '0' + this._minute;
};
time.prototype.add_and_return = function(minutes) {
	//this._hour+=( ((minutes+this._minute)/60) | 0 );
	//this._minute+=((minutes+this._minute)%60);
	return new time(this._hour + (((minutes + this._minute) / 60) | 0), (minutes + this._minute) % 60);
};
time.prototype.sub_and_return = function(minutes) {
	//this._hour+=( ((minutes+this._minute)/60) | 0 );
	//this._minute+=((minutes+this._minute)%60);
	var newminutes = this._minute - minutes;
	var hourstosub = 0;
	while (newminutes < 0) {
		newminutes += 60;
		hourstosub++;
	}
	return new time(this._hour - hourstosub, newminutes);
};
time.prototype.ifbiggerthan = function(time) {
	// if this is greater than timerange
	if (time.hour() < this.hour() || (time.hour() == this.hour() && time.minute() < this.minute())) {
		return true;
	} else {
		return false;
	}
};
time.prototype.ifbiggerorequal = function(time) {
	// if this is greater than timerange
	if (time.hour() < this.hour() || (time.hour() == this.hour() && time.minute() <= this.minute())) {
		return true;
	} else {
		return false;
	}
};
time.prototype.ifsmallerthan = function(time) {
	// if this is less than timerange
	if (time.hour() > this.hour() || (time.hour() == this.hour() && time.minute() > this.minute())) {
		return true;
	} else {
		return false;
	}
};
time.prototype.ifsmallerorequal = function(time) {
	// if this is less than timerange
	if (time.hour() > this.hour() || (time.hour() == this.hour() && time.minute() >= this.minute())) {
		return true;
	} else {
		return false;
	}
};

var time_range = function(start, end, value = 0) {
	this._start = start;
	this._end = end;
	this._value = value;
};
time_range.prototype.start = function() {
	return this._start;
};
time_range.prototype.end = function() {
	return this._end;
};
time_range.prototype.string = function() {
	return this._start.string() + ' - ' + this._end.string();
};
time_range.prototype.tominutes = function() {
	var temp;
	temp = (this._end.hour() - this._start.hour()) * 60 + (this._end.minute() - this._start.minute());
	return temp;
};
time_range.prototype.slice = function(
	length,
	minutes_between_appointment,
	minsevicetime,
	valuefornospaces,
	fromsmart = true
) {
	var tmp = [];
	var sum = length + minutes_between_appointment;
	var minutes = this.tominutes();

	var remainintimerange = 0;
	remainintimerange = minutes % sum;
	var timerangecount = Math.floor(minutes / sum);
	var i = 0;
	for (i = 0; i < timerangecount; i++) {
		tmp.push(
			new time_range(this._start.add_and_return(sum * i), this._start.add_and_return(sum * (i + 1)), this._value)
		);
	}

	if (!isEmpty(tmp)) {
		tmp[0]._value += valuefornospaces;
		var temp = tmp.pop();
		if (remainintimerange < minsevicetime) {
			if (remainintimerange > minutes_between_appointment) {
				if (remainintimerange > 3) temp._value -= valuefornospaces / 2;
			} else {
				if (remainintimerange >= 3)
					temp._value += (1 - remainintimerange / (minutes_between_appointment + 1)) * valuefornospaces;
			}
		}
		tmp.push(temp);
	}
	if (fromsmart) {
		if (remainintimerange > 0)
			tmp.push(new time_range(this._end.sub_and_return(sum), this._end, this._value + valuefornospaces));
	}

	return tmp;
};

function Day(date, free) {
	(this.Date = date), (this.Free = free);
}
Day.prototype.slice = function(length, minutes_between_appointment, minsevicetime, valuefornospaces, fromsmart = true) {
	var tmp = [];

	this.Free.forEach((timerange) => {
		tmp = tmp.concat(
			timerange.slice(length, minutes_between_appointment, minsevicetime, valuefornospaces, fromsmart)
		);
	});
	this.Free = [];
	//to do (check date)
	this.Free = tmp;
};
Day.prototype.slicewithnospace = function(length, minutes_between_appointment, minsevicetime, valuefornospaces) {
	var tmp = [];
	this.Free.forEach((timerange) => {
		var tmptimerange = [];
		tmptimerange = timerange.slice(length, minutes_between_appointment, minsevicetime, valuefornospaces);
		if (!isEmpty(tmptimerange)) {
			tmp = tmp.concat([ tmptimerange[0] ]);
			if (tmptimerange.length > 1) tmp = tmp.concat([ tmptimerange[tmptimerange.length - 1] ]);
		}
	});

	this.Free = [];
	this.Free = tmp;
};

Day.prototype.removeduplicates = function() {
	var uniquefreetime = [];
	//console.log(util.inspect(this.Free, {depth: null}));
	this.Free.forEach(function(onetimerange) {
		if (!isEmpty(uniquefreetime)) {
			var foundindex = uniquefreetime.findIndex(
				(element) =>
					element._start._hour == onetimerange._start._hour &&
					element._start._minute == onetimerange._start._minute &&
					element._end._hour == onetimerange._end._hour &&
					element._end._minute == onetimerange._end._minute
			);
			if (foundindex != -1) {
				if (uniquefreetime[foundindex]._value < onetimerange._value) {
					uniquefreetime[foundindex]._value = onetimerange._value;
				}
			} else {
				uniquefreetime.push(onetimerange);
			}
		} else {
			uniquefreetime.push(onetimerange);
		}
		//timeranges.push( new time_range(new time(onetimerange._start._hour,onetimerange._start._minute) , new time(onetimerange._end._hour,onetimerange._end._minute) ) );
	});
	this.Free = uniquefreetime;
};
Day.prototype.mergewithcustomerandsave = async function(customerappointment) {
	this.Free = await mergewithcostumer(this.Free, customerappointment, this.Date);
};
exports.time_range;

function diffDays(date_from, date_until) {
	var timeDiff = date_until.getTime() - date_from.getTime();
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	return diffDays;
}
//creat business and dates if not found and return the freeTime _id if the busness
async function creatifempty(businessid, workinghours, date_from, date_until) {
	const newbusiness = await creatbusinessifempty(businessid);
	var freeobj;
	var free = [];
	var freeid;
	var daysnum = diffDays(date_from, date_until);
	for (var i = 0; i <= daysnum; i++) {
		freeobj = workinghours.filter(function(element) {
			if (element.opened) {
				return element.day === moment(date_from).add(i, 'days').format('dddd').toLowerCase();
			} else return false;
		});

		if (isEmpty(freeobj)) {
			continue;
		}
		free = [];
		freeobj.forEach(function(element) {
			if (!element.break.isBreak) {
				from = new time(element.from.getHours(), element.from.getMinutes());
				until = new time(element.until.getHours(), element.until.getMinutes());
				free.push(new time_range(from, until));
			} else {
				from1 = new time(element.from.getHours(), element.from.getMinutes());
				until1 = new time(element.break.from.getHours(), element.break.from.getMinutes());
				free.push(new time_range(from1, until1));

				from2 = new time(element.break.until.getHours(), element.break.until.getMinutes());
				until2 = new time(element.until.getHours(), element.until.getMinutes());
				free.push(new time_range(from2, until2));
			}
		});
		freeid = await creatDateifempty(
			newbusiness.business_id,
			moment(date_from).add(i, 'days').format('YYYY/MM/DD'),
			free
		);
	}
	if (!isEmpty(free)) return freeid;
	return false;
}
async function findtotalminutes(businessid) {
	var totalminutes = 0;
	const business = await Business.findOne({ _id: businessid });
	business.working_hours.forEach(function(element) {
		if (element.opened) {
			if (!element.break.isBreak) {
				var from = new time(element.from.getHours(), element.from.getMinutes());
				var until = new time(element.until.getHours(), element.until.getMinutes());
				var tmptimerange = new time_range(from, until);
				totalminutes += tmptimerange.tominutes();
			} else {
				from1 = new time(element.from.getHours(), element.from.getMinutes());
				until1 = new time(element.break.from.getHours(), element.break.from.getMinutes());
				var tmptimerange1 = new time_range(from1, until1);
				totalminutes += tmptimerange1.tominutes();
				from2 = new time(element.break.until.getHours(), element.break.until.getMinutes());
				until2 = new time(element.until.getHours(), element.until.getMinutes());
				var tmptimerange2 = new time_range(from2, until2);
				totalminutes += tmptimerange2.tominutes();
			}
		}
	});
	return totalminutes;
}

async function creatbusinessifempty(businessid) {
	//creatbusinessifempty
	const free = await FreeTime.findOne({ business_id: businessid });
	//console.log(free);
	if (!isEmpty(free)) return free;
	var totalminutes = await findtotalminutes(businessid);
	const newfree = await FreeTime.create({ business_id: businessid, totalworkingminuts: totalminutes });

	if (isEmpty(newfree)) return null;

	return newfree;
}
async function creatDateifempty(businessid, oneDate, free) {
	//creatDateifempty
	const curfree = await FreeTime.findOne({ business_id: businessid });
	var or = curfree.dates.find((o) => moment(o.day).format('YYYY/MM/DD') === oneDate);
	var id = curfree._id;
	if (isEmpty(or)) {
		await FreeTime.findById(id, function(err, freeTime) {
			if (err) throw err;
			freeTime.dates.push({ day: oneDate, freeTime: free });
			freeTime.save(function(err) {
				if (err) throw err;
				//FreeTime updated successfully
			});
		});
	}
	return id;
}
//choice=0 return the busness freetime slice it to slices /choice=1 choice=0 return the busness_freetime&costomer_freetime and slice it to slices/choice=2 only find free time of busness and return
async function returnfreetime(
	id,
	fromsmart = true,
	services_length,
	minutes_between_appointment,
	number_of_days_to_return,
	date_from,
	date_until,
	choice,
	customerid,
	checkifcustomerhavebusness,
	minsevicetime,
	valuefornospaces = 0,
	timerange = false,
	searchafterorbefor = 1,
	timerangefromedit = false
) {
	if (id === false) return false;
	var days = [];
	var tmp;
	var daysfree = [];
	var timeranges = [];
	var daysnum = diffDays(date_from, date_until);
	var customerappointment;
	var customersbusnessappointment;
	var customersbusness;
	if (choice == 1 || choice == 3) {
		customerappointment = await returnallappointmentsbycustomer(customerid);
		if (checkifcustomerhavebusness) {
			customersbusness = await Business.findOne({ owner_id: customerid });
			if (!isEmpty(customersbusness)) {
				customersbusnessappointment = await returnallappointmentsbybusiness(customersbusness._id);
			}
		}
	}
	const freetime = await FreeTime.findById(id);
	mongodays = freetime.dates.filter(function(element) {
		return 0 <= diffDays(element.day, date_until) && diffDays(element.day, date_until) <= daysnum;
	});

	mongodays.forEach(function(oneday) {
		freetobook = oneday.freeTime;
		thedate = oneday.day;
		timeranges = [];
		freetobook.forEach(function(onetimerange) {
			timeranges.push(
				new time_range(
					new time(onetimerange._start._hour, onetimerange._start._minute),
					new time(onetimerange._end._hour, onetimerange._end._minute)
				)
			);
		});
		days.push(new Day(thedate, timeranges));
	});
	var tmpday;
	var tmpfree;
	var counter = 0;
	var correcter = 0;
	var tmpcorrector;
	var posibletobook = new BinarySearchTree();
	var day = new BinarySearchTree();

	do {
		if (days === undefined || days.length == 0) {
			break;
		}
		tmpday = days.shift();
		tmpfree = tmpday.Free;
		//to undo
		if (moment(tmpday.Date).format('YYYY/MM/DD') == moment().format('YYYY/MM/DD')) {
			var today = new Date();
			var tmptime;
			if (fromsmart === false) tmptime = new time(today.getHours(), today.getMinutes());
			else tmptime = new time(today.getHours() + 1, Math.round(today.getMinutes()));

			tmpfree = await mergetimerangelists(tmpfree, [ new time_range(tmptime, new time(24, 0)) ], 0, 1);
		} else if (moment(tmpday.Date).format('YYYY/MM/DD') < moment().format('YYYY/MM/DD')) {
			tmpfree = [];
		}
		//
		if (!(timerange === false)) {
			switch (searchafterorbefor) {
				case 0:
					var timebefor = new time(timerange._start._hour, timerange._start._minute);
					tmpfree = await mergetimerangelists(tmpfree, [ new time_range(new time(0, 0), timebefor) ], 0, 1);
					break;
				case 1:
					var timebefor = new time(timerange._end._hour, timerange._end._minute);
					tmpfree = await mergetimerangelists(tmpfree, [ new time_range(timeafter, new time(24, 0)) ], 0, 1);
					break;
				default:
				// code block
			}
		}
		//for nidal
		day.totree(tmpfree);
		if (timerangefromedit !== false) day.insert(timerangefromedit);

		posibletobook.totree(day.timerangesthatfit(services_length, minutes_between_appointment));
		tmpday.Free = posibletobook.arrayofopjects();
		if (choice == 1 || choice == 3) {
			await tmpday.mergewithcustomerandsave(customerappointment);
			if (checkifcustomerhavebusness && !isEmpty(customersbusness)) {
				await tmpday.mergewithcustomerandsave(customersbusnessappointment);
			}
		}
		if (choice == 0 || choice == 1)
			tmpday.slice(services_length, minutes_between_appointment, minsevicetime, valuefornospaces, fromsmart);
		daysfree.push(tmpday);
		counter++;
	} while (counter < number_of_days_to_return);

	return daysfree;
}
async function mergetimerangelists(timerangelist1, timerangelist2, mergevalue, choice = 0) {
	// var i=0;
	// var j=0;
	var tempend;
	var tempstart;
	var result = [];
	if (choice == 0) result = timerangelist1;
	// console.log("\n")
	// console.log(util.inspect(timerangelist1, {depth: null}));
	//  console.log(util.inspect(timerangelist2, {depth: null}));
	// console.log("\n")
	timerangelist2.forEach(function(fromtimerange2) {
		timerangelist1.forEach(function(fromtimerange1) {
			if (
				fromtimerange1._start.ifsmallerthan(fromtimerange2._end) &&
				fromtimerange1._end.ifbiggerthan(fromtimerange2._start)
			) {
				if (fromtimerange1._start.ifbiggerthan(fromtimerange2._start)) {
					tempstart = fromtimerange1._start;
				} else {
					tempstart = fromtimerange2._start;
				}

				if (fromtimerange1._end.ifsmallerthan(fromtimerange2._end)) {
					tempend = fromtimerange1._end;
				} else {
					tempend = fromtimerange2._end;
				}
				//console.log(util.inspect(result, {depth: null}));
				result = result.filter(function(element) {
					if (
						element._start._hour == tempstart._hour &&
						element._start._minute == tempstart._minute &&
						element._end._hour == tempend._hour &&
						element._end._minute == tempend._minute
					)
						return false;
					else return true;
				});

				result.push(new time_range(tempstart, tempend, fromtimerange1._value + mergevalue));
			}
		});
	});
	return result;
}
async function returnallappointmentsbycustomer(customerid) {
	const appointments = await Appointment.find({
		client_id : customerid,
		status    : { $in: [ 'ready', 'inProgress', 'done' ] }
	});
	return appointments;
}
async function returnallappointmentsbybusiness(businessid) {
	const appointments = await Appointment.find({
		business_id : businessid,
		status      : { $in: [ 'ready', 'inProgress', 'done' ] }
	});
	return appointments;
}
async function mergewithcostumer(Free, appointments, oneDate) {
	//  console.log("merge this\n")
	//  console.log(await returnfreeondate(appointments,oneDate))
	//  console.log("with this\n")
	//  console.log(Free)
	//  console.log("=\n")
	//  console.log(await mergetimerangelists(Free, await returnfreeondate(appointments,oneDate),0,1))
	return await mergetimerangelists(Free, await returnfreeondate(appointments, oneDate), 0, 1);
}
async function returnfreeondate(appointments, oneDate) {
	var free = [];

	//console.log(oneDate)
	//console.log(util.inspect(appointments, {depth: null}));
	var appointmentsondate = appointments.filter(function(element) {
		if (moment(element.time.date).format('YYYY/MM/DD') === moment(oneDate).format('YYYY/MM/DD')) return true;
		return false;
	});

	var day = new BinarySearchTree();
	day.totree([ new time_range(new time(0, 0), new time(24, 0)) ]);
	if (!isEmpty(appointmentsondate)) {
		//console.log(util.inspect(appointmentsondate, {depth: null}));
		appointmentsondate.forEach(function(oneappointment) {
			var tmptime = new time_range(
				new time(oneappointment.time.start._hour, oneappointment.time.start._minute),
				new time(oneappointment.time.end._hour, oneappointment.time.end._minute)
			);
			var result = day.book(tmptime);
			if (result == false) console.log('error on finding date on customer');
		});
	}
	if (isEmpty(day.arrayofopjects())) return [];
	return day.arrayofopjects(); /* await pending */
}
async function mergewithbusnessbusnessbusyhour(businessid, freetime, valueofbusnessbusyhours) {
	var rate = await calculatebusnessbusyhours(businessid);
	//var countpointment = rate.totalpointment;
	//var totalminutes = await findtotalminutes(businessid);
	//var avgappointmentpeerhour = countpointment / (totalminutes / 60);
	//console.log(util.inspect(freetime, {depth: null}));
	freetime.forEach(function(oneday) {
		var tmpdate = moment(oneday.Date).format('dddd').toLowerCase();
		oneday.Free.forEach(function(onetimerange) {
			var totalrate = 0;
			//var timerangerateavg = 0;
			var finalvaluetoadd = 0;
			var i;
			var timerangetime = onetimerange.tominutes();
			var temptimerangpart;
			var starthour = onetimerange._start._hour;
			var startminute = onetimerange._start._minute;
			var endhour = onetimerange._end._hour;
			var endminute = onetimerange._end._minute;
			if (timerangetime == 0) return;
			for (i = starthour; i < endhour || (i == endhour && 0 < endminute); i++) {
				var minutes = 60;
				if ((starthour = i && starthour < endhour)) {
					minutes = new time_range(new time(starthour, startminute), new time(starthour + 1, 0)).tominutes();
				} else if (i == endhour && 0 < endminute) {
					if (endhour == starthour)
						minutes = new time_range(
							new time(starthour, startminute),
							new time(endhour, endminute)
						).tominutes();
					else {
						minutes = new time_range(new time(i, 0), new time(endhour, endminute)).tominutes();
					}
				}

				totalrate += (1 - rate[tmpdate][i] / rate.top) * valueofbusnessbusyhours * (minutes / timerangetime);
			}
			if (totalrate >= 0) {
				onetimerange._value += totalrate;
			}
		});
	});
	//console.log(util.inspect(rate, {depth: null}));
	return true;
}

async function calculatebusnessbusyhours(businessid) {
	var rate = {
		sunday         : {
			0  : 0,
			1  : 0,
			2  : 0,
			3  : 0,
			4  : 0,
			5  : 0,
			6  : 0,
			7  : 0,
			8  : 0,
			9  : 0,
			10 : 0,
			11 : 0,
			12 : 0,
			13 : 0,
			14 : 0,
			15 : 0,
			16 : 0,
			17 : 0,
			18 : 0,
			19 : 0,
			20 : 0,
			21 : 0,
			22 : 0,
			23 : 0
		},
		monday         : {
			0  : 0,
			1  : 0,
			2  : 0,
			3  : 0,
			4  : 0,
			5  : 0,
			6  : 0,
			7  : 0,
			8  : 0,
			9  : 0,
			10 : 0,
			11 : 0,
			12 : 0,
			13 : 0,
			14 : 0,
			15 : 0,
			16 : 0,
			17 : 0,
			18 : 0,
			19 : 0,
			20 : 0,
			21 : 0,
			22 : 0,
			23 : 0
		},
		tuesday        : {
			0  : 0,
			1  : 0,
			2  : 0,
			3  : 0,
			4  : 0,
			5  : 0,
			6  : 0,
			7  : 0,
			8  : 0,
			9  : 0,
			10 : 0,
			11 : 0,
			12 : 0,
			13 : 0,
			14 : 0,
			15 : 0,
			16 : 0,
			17 : 0,
			18 : 0,
			19 : 0,
			20 : 0,
			21 : 0,
			22 : 0,
			23 : 0
		},
		wednesday      : {
			0  : 0,
			1  : 0,
			2  : 0,
			3  : 0,
			4  : 0,
			5  : 0,
			6  : 0,
			7  : 0,
			8  : 0,
			9  : 0,
			10 : 0,
			11 : 0,
			12 : 0,
			13 : 0,
			14 : 0,
			15 : 0,
			16 : 0,
			17 : 0,
			18 : 0,
			19 : 0,
			20 : 0,
			21 : 0,
			22 : 0,
			23 : 0
		},
		thursday       : {
			0  : 0,
			1  : 0,
			2  : 0,
			3  : 0,
			4  : 0,
			5  : 0,
			6  : 0,
			7  : 0,
			8  : 0,
			9  : 0,
			10 : 0,
			11 : 0,
			12 : 0,
			13 : 0,
			14 : 0,
			15 : 0,
			16 : 0,
			17 : 0,
			18 : 0,
			19 : 0,
			20 : 0,
			21 : 0,
			22 : 0,
			23 : 0
		},
		friday         : {
			0  : 0,
			1  : 0,
			2  : 0,
			3  : 0,
			4  : 0,
			5  : 0,
			6  : 0,
			7  : 0,
			8  : 0,
			9  : 0,
			10 : 0,
			11 : 0,
			12 : 0,
			13 : 0,
			14 : 0,
			15 : 0,
			16 : 0,
			17 : 0,
			18 : 0,
			19 : 0,
			20 : 0,
			21 : 0,
			22 : 0,
			23 : 0
		},
		saturday       : {
			0  : 0,
			1  : 0,
			2  : 0,
			3  : 0,
			4  : 0,
			5  : 0,
			6  : 0,
			7  : 0,
			8  : 0,
			9  : 0,
			10 : 0,
			11 : 0,
			12 : 0,
			13 : 0,
			14 : 0,
			15 : 0,
			16 : 0,
			17 : 0,
			18 : 0,
			19 : 0,
			20 : 0,
			21 : 0,
			22 : 0,
			23 : 0
		},
		totalpointment : 0,
		top            : 0
	};
	var tmphour;
	const appointments = await returnallappointmentsbybusiness(businessid);
	appointments.forEach(function(oneappointment) {
		var tmpendhour = oneappointment.time.end._hour;
		var tmpdaybefore = oneappointment.time.date;
		var tmpdayafter = moment(tmpdaybefore).format('dddd').toLowerCase();
		for (tmphour = oneappointment.time.start._hour; tmphour <= tmpendhour; tmphour++) {
			rate[tmpdayafter][tmphour]++;
			if (rate[tmpdayafter][tmphour] > rate.top) rate.top = rate[tmpdayafter][tmphour];
		}

		rate.totalpointment++;
	});
	return rate;
}

function compareValues(v1, v2) {
	return v1 > v2 ? -1 : v1 < v2 ? 1 : 0;
}
function compareTime(v1, v2) {
	if (v2._hour > v1._hour || (v2._hour == v1._hour && v2._minute > v1._minute)) return -1;
	else return 1;
}
function compare2timerange(x, y) {
	var result = compareValues(x._value, y._value);

	return result === 0 ? compareTime(x._start, y._start) : result;
}
async function mergewithpreferhours(preferhours, freetime, value) {
	var tomerge = [ preferhours ];
	for (let i = 0; i < freetime.length; i++) {
		const tmmp = await mergetimerangelists(freetime[i].Free, tomerge, value);
		freetime[i].Free = tmmp;
	}
	return {};
}
async function pickthehighestifsliced(freetime, numberToReturnADay) {
	for (let i = 0; i < freetime.length; i++) {
		var tmparray = [];
		const tmp = freetime[i].Free.sort(function(x, y) {
			return compare2timerange(x, y);
		});
		for (let j = 0; j < numberToReturnADay && j < tmp.length; j++) {
			tmparray.push(tmp[j]);
		}
		freetime[i].Free = tmparray;
	}

	return {};
}
async function pickthehighestifnotsliced(
	freetime,
	services_length,
	minutes_between_appointment,
	minsevicetime,
	valuefornospaces,
	numberToReturnADay
) {
	for (let i = 0; i < freetime.length; i++) {
		var tmparray = [];

		freetime[i].slicewithnospace(services_length, minutes_between_appointment, minsevicetime, valuefornospaces);
		freetime[i].removeduplicates();
		const tmp = freetime[i].Free.sort(function(x, y) {
			return compare2timerange(x, y);
		});
		for (let j = 0; j < numberToReturnADay + 2 && j < tmp.length; j++) {
			tmparray.push(tmp[j]);
		}
		freetime[i].Free = tmparray;
	}
	return {};
}
async function findmintimeinservice(businessid) {
	const business = await Business.findOne({ _id: businessid });
	const min = Math.min.apply(null, business.services.map((oneservice) => oneservice.time));
	return min;
}

async function findchangesandupdate(businessid, appointments, array, days) {
	const freetime = await FreeTime.findOne({ business_id: businessid });
	const business = await Business.findOne({ _id: businessid });
	if (isEmpty(freetime)) return { state: 'there are no freetime to update' };
	let allDates = freetime.dates;
	const test = await allDates.forEach(async function(onedate, i) {
		if (array[days[moment(onedate.day).format('dddd').toLowerCase()]]) {
			var onedateapointments = appointments.filter(function(element) {
				if (moment(element.time.date).format('YYYY/MM/DD') === moment(onedate.day).format('YYYY/MM/DD'))
					return true;
				return false;
			});
			var oneworkinghours = business.working_hours.find(function(element) {
				if (element.opened) {
					return element.day === moment(onedate.day).format('dddd').toLowerCase();
				} else return false;
			});
			if (!isEmpty(oneworkinghours)) {
				var tmpfree = await updatethisdayandretturn(onedateapointments, oneworkinghours);
				allDates[i].freeTime = tmpfree;
				//console.log(util.inspect(await onedate, {depth: null}));
			} else {
				await updatethisdayandretturn(onedateapointments);
				allDates.splice(i, 1);
			}
		}
	});
	await test;
	const edits = await allDates;
	//console.log(util.inspect(edits, {depth: null}));

	const update = {
		$set : {
			dates : edits
		}
	};
	const newfree = await FreeTime.findOneAndUpdate({ business_id: businessid }, update, { new: true });

	//console.log(newfree);
	// console.log(util.inspect(newfree, {depth: null}));
	return freetime._id;
}
async function updatethisdayandretturn(onedateapointments, oneworkinghours = false) {
	var free = [];
	if (oneworkinghours !== false) {
		if (!oneworkinghours.break.isBreak) {
			var from = new time(oneworkinghours.from.getHours(), oneworkinghours.from.getMinutes());
			var until = new time(oneworkinghours.until.getHours(), oneworkinghours.until.getMinutes());
			free.push(new time_range(from, until));
		} else {
			var from1 = new time(oneworkinghours.from.getHours(), oneworkinghours.from.getMinutes());
			var until1 = new time(oneworkinghours.break.from.getHours(), oneworkinghours.break.from.getMinutes());
			free.push(new time_range(from1, until1));

			var from2 = new time(oneworkinghours.break.until.getHours(), oneworkinghours.break.until.getMinutes());
			var until2 = new time(oneworkinghours.until.getHours(), oneworkinghours.until.getMinutes());
			free.push(new time_range(from2, until2));
		}

		if (!isEmpty(onedateapointments)) {
			var day = new BinarySearchTree();
			day.totree(free);
			onedateapointments.forEach(async function(oneappointment) {
				var chosentimerange = new time_range(
					new time(oneappointment.time.start._hour, oneappointment.time.start._minute),
					new time(oneappointment.time.end._hour, oneappointment.time.end._minute)
				);
				if (!day.book(chosentimerange)) {
					await cancelappointmentbyid(oneappointment._id);
					//console.log("canceled apointment id = "+oneappointment._id)
				}
			});
			free = [];
			free = day.arrayofopjects();
		}
	} else {
		if (!isEmpty(onedateapointments)) {
			onedateapointments.forEach(function(oneappointment) {
				cancelappointmentbyid(oneappointment._id);
			});
			//console.log("canceled all this apointment in this day "+onedateapointments[0].day)
		}
	}
	return free;
}
async function cancelappointmentbyid(appointmentid) {
	Appointment.findById(appointmentid, function(err, appointment) {
		if (err) throw err;
		appointment.status = 'pendingBusiness';
		appointment.save(function(err) {
			if (err) throw err;
			//appointment updated successfully
		});
	});
}
async function searchforawaytoswitch(businessid, customerid, apointmentdate, tobook, todelete, apointmentlenght) {
	var appointments = await returnallappointmentsbybusiness(businessid);
	var tobeafectedapointmentid = 0;
	var newtobook;
	var ifcanbeswitched = appointments.some(async function(oneappointment) {
		if (moment(oneappointment.time.date).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD')) {
			var tmptime = new time_range(
				new time(oneappointment.time.start._hour, oneappointment.time.start._minute),
				new time(oneappointment.time.end._hour, oneappointment.time.end._minute)
			);
			var conflectresult = findtimerangeinconflect(tmptime, tobook);
			switch (conflectresult) {
				case 0:
					// code block
					break;
				case 1:
					newtobook = new time_range(tmptime._start.sub_and_return(apointmentlenght), tmptime._start);
					if (await bookFunction(businessid, apointmentdate, newtobook)) {
						tobeafectedapointmentid = oneappointment_id;
						return true;
					}
					break;
				case 2:
					newtobook = new time_range(tmptime._end, tmptime._end.add_and_return(apointmentlenght));
					if (await bookFunction(businessid, apointmentdate, newtobook)) {
						tobeafectedapointmentid = oneappointment_id;
						return true;
					}
					break;
				case 3:
					newtobook = new time_range(tmptime._start.sub_and_return(apointmentlenght), tmptime._start);
					if (await bookFunction(businessid, apointmentdate, newtobook)) {
						tobeafectedapointmentid = oneappointment_id;
						return true;
					} else {
						newtobook = new time_range(tmptime._end, tmptime._end.add_and_return(apointmentlenght));
						if (await bookFunction(businessid, apointmentdate, newtobook)) {
							tobeafectedapointmentid = oneappointment_id;
							return true;
						}
					}

					break;
				default:
				// code block
			}
		}
	});
	if (!ifcanbeswitched) {
		await bookFunction(businessid, apointmentdate, todelete);
		return 0;
	}
	return [ tobeafectedapointmentid, newtobook ];
}
//0=not in coflect //1=conflect from the left //2=conflectfrom the right //3=conflect from both sides
async function findtimerangeinconflect(timerange, timerange_to_book) {
	if (
		timerange_to_book._start.ifsmallerthan(timerange._start) &&
		timerange_to_book._end.ifbiggerthan(timerange._start) &&
		timerange_to_book._end.ifsmallerorequal(timerange._end)
	)
		return 1;
	else if (
		timerange_to_book._end.ifbiggerthan(timerange._end) &&
		timerange_to_book._start.ifsmallerthan(timerange._end)
	) {
		if (timerange_to_book._start.ifsmallerthan(timerange._start)) return 3;
		else return 2;
	} else return 0;
}
async function updatethisapointmenttonewtimerange(appointmentid, timerange_to_book) {
	const update = {
		$set : {
			start : {
				_hour   : timerange_to_book._start._hour,
				_minute : timerange_to_book._start._minute
			},
			end   : {
				_hour   : timerange_to_book._end._hour,
				_minute : timerange_to_book._end._minute
			}
		}
	};
	const newappointment = await Appointment.findOneAndUpdate({ _id: appointmentid }, update, { new: true });
	if (!isEmpty(newappointment)) return true;
	return false;
}
async function smartFunction(
	businessid,
	services,
	customerid,
	preferhours,
	checkifcustomerhavebusness,
	toreturnadaybycustomer,
	customerdesidedates,
	datefrom,
	dateuntil,
	timerange,
	searchafterorbefor,
	timerangefromedit
) {
	var choice;
	var exp;
	var date_from;
	var date_until;
	var prevelaged = false;
	var tempfreetime = [];
	const business = await Business.findOne({ _id: businessid });
	const experiance_rule_exp = [ 0, 50, 100, 200, 400, 800 ];

	const icaraboutcustomeexperiance = business.schedule_settings.customers_exp;
	const experiance_rule = business.schedule_settings.experiance_rule;
	const valuefornospaces = business.schedule_settings.continuity;
	const valueofpreferhours = business.schedule_settings.customer_prefered_period;
	const valueofbusnessbusyhours = business.schedule_settings.distrbuted_time;
	const days_to_return = business.schedule_settings.days_calculate_length;
	const number_of_days_to_return = business.schedule_settings.max_working_days_response;
	const range_definition = business.schedule_settings.range_definition;
	const toreturnadaybybusiness = business.schedule_settings.max_days_to_return;
	//
	// const range_definition = {
	// 	morning   : { start: { _hour: 7, _minute: 0 }, end: { _hour: 12, _minute: 0 } },
	// 	afternoon : { start: { _hour: 12, _minute: 0 }, end: { _hour: 17, _minute: 0 } },
	// 	evening   : { start: { _hour: 17, _minute: 0 }, end: { _hour: 23, _minute: 0 } }
	// };
	// const toreturnadaybybusiness = 2;
	//
	var numberToReturnADay;
	if (toreturnadaybybusiness < toreturnadaybycustomer) numberToReturnADay = toreturnadaybycustomer;
	else numberToReturnADay = toreturnadaybybusiness;

	const servicearray = await business.services.filter(function(service) {
		return services.includes(service.service_id.toString());
	});

	var minsevicetime = await findmintimeinservice(businessid);
	if (isEmpty(business)) return { error: 'invalid business' };
	if (icaraboutcustomeexperiance == true) {
		const customerinbusness = await business.customers.find((o) => customerid === o.customer_id.toString());
		if (!isEmpty(customerinbusness)) exp = customerinbusness.experiance;
		else exp = 0;
	} else {
		exp = 0;
	}
	if (exp >= experiance_rule_exp[experiance_rule]) {
		prevelaged = true;
		choice = 1;
	} else {
		prevelaged = false;
		choice = 3;
	}

	var services_length = 0;
	var services_cost = 0;
	servicearray.forEach(function(oneservice) {
		services_length += oneservice.time;
		services_cost += oneservice.cost;
	});

	var minutes_between_appointment = business.break_time;
	var workinghours = business.working_hours;
	if (customerdesidedates !== false && (datefrom !== false) & (dateuntil !== false)) {
		date_from = datefrom;
		date_until = dateuntil;
	} else {
		var tmp = new Date();
		date_from = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
		date_until = moment(date_from).add(days_to_return, 'days').toDate();
	}
	tempfreetime = await returnfreetime(
		await creatifempty(businessid, workinghours, date_from, date_until),
		true,
		services_length,
		minutes_between_appointment,
		number_of_days_to_return,
		date_from,
		date_until,
		choice,
		customerid,
		checkifcustomerhavebusness,
		minsevicetime,
		valuefornospaces,
		timerange,
		searchafterorbefor,
		timerangefromedit
	);
	var preferhoursrange;
	if (preferhours !== false && preferhours <= 2 && preferhours >= 0) {
		switch (preferhours) {
			case 0:
				preferhoursrange = new time_range(
					new time(range_definition.morning._start._hour, range_definition.morning._start._minute),
					new time(range_definition.morning._end._hour, range_definition.morning._end._minute)
				);
				break;
			case 1:
				preferhoursrange = new time_range(
					new time(range_definition.afternoon._start._hour, range_definition.afternoon._start._minute),
					new time(range_definition.afternoon._end._hour, range_definition.afternoon._end._minute)
				);
				break;
			case 2:
				preferhoursrange = new time_range(
					new time(range_definition.evening._start._hour, range_definition.evening._start._minute),
					new time(range_definition.evening._end._hour, range_definition.evening._end._minute)
				);
				break;
			default:
			// code block
		}
		await mergewithpreferhours(preferhoursrange, tempfreetime, valueofpreferhours);
	}

	await mergewithbusnessbusnessbusyhour(businessid, tempfreetime, valueofbusnessbusyhours);

	if (prevelaged == true) await pickthehighestifsliced(tempfreetime, numberToReturnADay);
	else
		await pickthehighestifnotsliced(
			tempfreetime,
			services_length,
			minutes_between_appointment,
			minsevicetime,
			valuefornospaces,
			numberToReturnADay
		);
	if (tempfreetime === false || isEmpty(tempfreetime)) return {};
	return tempfreetime;
}
async function bookFunction(businessid, chosendate, chosentimerange, bookandsave = true) {
	var resulte;
	var days = [];
	var tmpfree = [];
	var freetobook;
	var timeranges = [];
	const freetime = await FreeTime.findOne({ business_id: businessid });
	if (isEmpty(freetime)) return { error: 'invalid business' };

	var daysinmongo = freetime.dates.find(
		(o) => moment(o.day).format('YYYY/MM/DD') === moment(chosendate).format('YYYY/MM/DD')
	);
	var id = freetime._id;
	if (isEmpty(daysinmongo)) return { error: 'invalid Date' };
	else {
		//console.l]]]]og(daysinmongo);
		freetobook = daysinmongo.freeTime;
		timeranges = [];
		freetobook.forEach(function(onetimerange) {
			timeranges.push(
				new time_range(
					new time(onetimerange._start._hour, onetimerange._start._minute),
					new time(onetimerange._end._hour, onetimerange._end._minute)
				)
			);
		});
	}
	days.push(new Day(chosendate, timeranges));
	//console.log(`before: ${chosentimerange}`)
	var tobook = new time_range(
		new time(chosentimerange._start._hour, chosentimerange._start._minute),
		new time(chosentimerange._end._hour, chosentimerange._end._minute)
	);
	//console.log("after"+tobook)
	var day = new BinarySearchTree();
	tmpfree = days.shift();
	day.totree(tmpfree.Free);
	try {
		resulte = day.book(tobook);
	} catch (error) {
		console.log('invalid Time');
		return { error: 'invalid Time' };
	}
	if (resulte) {
		if (bookandsave) {
			var newfreetime = day.arrayofopjects();

			await FreeTime.findById(id, function(err, freeTime) {
				if (err) throw err;
				var foundIndex = freeTime.dates.findIndex(
					(o) => moment(o.day).format('YYYY/MM/DD') === moment(chosendate).format('YYYY/MM/DD')
				);
				freeTime.dates[foundIndex].freeTime = newfreetime;
				freeTime.save(function(err) {
					if (err) throw err;
					//FreeTime updated successfully
				});
			});
		}

		///////////////////////////////////////////////

		//console.log(newfreetime);
		return true;
	} else {
		return false;
	}
}
async function deletedFunction(businessid, chosendate, chosentimerange) {
	const freetime = await FreeTime.findOne({ business_id: businessid });
	if (isEmpty(freetime)) {
		return { error: 'invalid business' };
	}
	var id = freetime._id;
	var daysinmongo = freetime.dates.find(
		(o) => moment(o.day).format('YYYY/MM/DD') === moment(chosendate).format('YYYY/MM/DD')
	);
	var freetobook = daysinmongo.freeTime;
	timeranges = [];
	freetobook.forEach(function(onetimerange) {
		timeranges.push(
			new time_range(
				new time(onetimerange._start._hour, onetimerange._start._minute),
				new time(onetimerange._end._hour, onetimerange._end._minute)
			)
		);
	});
	var tobook = new time_range(
		new time(chosentimerange._start._hour, chosentimerange._start._minute),
		new time(chosentimerange._end._hour, chosentimerange._end._minute)
	);
	var day = new BinarySearchTree();
	day.totree(timeranges);
	result = await day.insert(tobook);
	if (result) {
		await FreeTime.findById(id, function(err, freeTime) {
			if (err) throw err;
			var foundIndex = freeTime.dates.findIndex(
				(o) => moment(o.day).format('YYYY/MM/DD') === moment(chosendate).format('YYYY/MM/DD')
			);
			freeTime.dates[foundIndex].freeTime.push(tobook);
			freeTime.save(function(err) {
				if (err) throw err;
				//FreeTime updated successfully
			});
		});
	}
	return result;
}

/***********************************************************************************/

module.exports = {
	//in 'choice' you dicede if you want  0: the next number of 'days' or 1: spiceifec 'date'
	freeAlg                         : async (
		businessid,
		services,
		date_from,
		date_until,
		choice = 0,
		customerid = 0,
		number_of_days_to_return = 7,
		checkifcustomerhavebusness = true
	) => {
		var tempfreetime = [];
		const business = await Business.findOne({ _id: businessid });

		const servicearray = await business.services.filter(function(service) {
			return services.includes(service.service_id.toString());
		});
		var minsevicetime = await findmintimeinservice(businessid);
		if (isEmpty(business)) return { error: 'invalid business' };

		var services_length = 0;
		var services_cost = 0;
		servicearray.forEach(function(oneservice) {
			services_length += oneservice.time;
			services_cost += oneservice.cost;
		});
		var minutes_between_appointment = business.break_time;
		var workinghours = business.working_hours;
		tempfreetime = await returnfreetime(
			await creatifempty(businessid, workinghours, date_from, date_until),
			false,
			services_length,
			minutes_between_appointment,
			number_of_days_to_return,
			date_from,
			date_until,
			choice,
			customerid,
			checkifcustomerhavebusness,
			minsevicetime
		);
		//console.log(util.inspect(tempfreetime, {depth: null}));
		if (tempfreetime === false || isEmpty(tempfreetime)) return {};
		return tempfreetime;
	},
	//to use after you book
	booked                          : async (
		businessid,
		chosendate,
		chosentimerange,
		checkifcustomerhavebusness = true,
		returnsuggest = false,
		customerid = false
	) => {
		var bookresult = await bookFunction(businessid, chosendate, chosentimerange, true);
		if (checkifcustomerhavebusness && bookresult && customerid !== false) {
			var customersbusness = await Business.findOne({ owner_id: customerid });
			if (!isEmpty(customersbusness)) {
				bookresult = await bookFunction(customersbusness._id, chosendate, chosentimerange, true);
			}
		}
		var userreminders;
		if (returnsuggest) {
			//serach on 'businessid' and 'customerid'
			//pull this doc from reminder if 'repeat' is 'false'
			//else change 'date_to' to 'date.now +days'
			userreminders = await User.findOne({ _id: customerid }).reminders;
			if (isEmpty(userreminders)) return [ bookresult, false ];
			//check reminders
			var index = userreminders.findIndex((o) => o.business_id == businessid);
			if (index > -1) {
				if (userreminders[index].repeat) {
					var tmp = new Date();
					var date_from = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
					var date_until = moment(date_from).add(userreminders[index].days, 'days').toDate();
					userreminders[index].date_to = date_until;
				} else userreminders.splice(index, 1);

				const update = {
					$set : {
						reminders : userreminders
					}
				};
				await User.findOneAndUpdate({ _id: customerid }, update, { new: true });
			}
		} else {
			return bookresult;
		}
		//
		var tostartsmarton = userreminders.find(
			(o) => moment(o.date_to).format('YYYY/MM/DD') < moment().add(1, 'days').format('YYYY/MM/DD')
		);
		if (isEmpty(tostartsmarton)) return [ bookresult, false ];

		return [
			bookresult,
			true,
			tostartsmarton.business_id,
			await smartFunction(
				tostartsmarton.business_id,
				tostartsmarton.services,
				customerid,
				false,
				true,
				5,
				true,
				tostartsmarton.date_to,
				tostartsmarton.date_to,
				chosentimerange,
				0,
				false
			),
			await smartFunction(
				tostartsmarton.business_id,
				tostartsmarton.services,
				customerid,
				false,
				true,
				5,
				true,
				tostartsmarton.date_to,
				tostartsmarton.date_to,
				chosentimerange,
				1,
				false
			)
		];
	},
	ifcanbook                       : async (
		businessid,
		chosendate,
		chosentimerange,
		checkifcustomerhavebusness = true
	) => {
		var bookresult = await bookFunction(businessid, chosendate, chosentimerange, false);

		return bookresult;
	},
	deleted                         : async (businessid, chosendate, chosentimerange) => {
		return await deletedFunction(businessid, chosendate, chosentimerange);
	}, /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	smart                           : async (
		businessid,
		services,
		customerid,
		preferhours = false,
		checkifcustomerhavebusness = true,
		customerdesidedates = false,
		datefrom = false,
		dateuntil = false,
		timerangefromedit = false,
		timerange = false,
		searchafterorbefor = 1,
		numberToReturnADay = 2
	) => {
		return await smartFunction(
			businessid,
			services,
			customerid,
			preferhours,
			checkifcustomerhavebusness,
			numberToReturnADay,
			customerdesidedates,
			datefrom,
			dateuntil,
			timerange,
			searchafterorbefor,
			timerangefromedit
		);
	},
	aftereditingbusnessworkinghours : async (businessid, array) => {
		var days = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
		var appointments = await returnallappointmentsbybusiness(businessid);
		var totalminutes = await findtotalminutes(businessid);
		//if(isEmpty(appointments))
		//return({error :'business have no apintment'});
		var freetimeid = await findchangesandupdate(businessid, appointments, array, days);
		await FreeTime.findById(freetimeid, function(err, freeTime) {
			if (err) throw err;
			freeTime.totalworkingminuts = totalminutes;
			freeTime.save(function(err) {
				if (err) throw err;
				//FreeTime updated successfully
			});
		});

		return {};
	},
	shiftappointmentifpossible      : async (businessid, appointmentid, checkin) => {
		const appointment = await Appointment.findById(appointmentid);
		var customerid = appointment.client_id;
		var apointmentdate = appointment.time.date;
		var apointmentstart = appointment.time.start;
		var apointmentend = appointment.time.end;
		var checkindate = checkin;
		var checkinminute = moment(checkindate).minutes();
		var checkinhours = moment(checkindate).hours();
		var todelete = new time_range(
			new time(apointmentstart._hour, apointmentstart._minute),
			new time(apointmentend._hour, apointmentend._minute)
		);
		var apointmentlenght = todelete.tominutes();
		var tobookstart = new time(checkinhours, checkinminute);
		var tobookend = tobookstart.add_and_return(apointmentlenght);

		var tobook = new time_range(tobookstart, tobookend);

		await deletedFunction(businessid, apointmentdate, todelete);
		if (await bookFunction(businessid, apointmentdate, tobook)) {
			//await updatethisapointmenttonewtimerange(appointmentid, tobook);
			return { ok: true, appointmentnewtimerange: tobook };
		} else {
			var result = await searchforawaytoswitch(
				businessid,
				customerid,
				apointmentdate,
				tobook,
				todelete,
				apointmentlenght
			);
			if (result === 0) return { ok: false, fixed: false };
			//await updatethisapointmenttonewtimerange(appointmentid, result[1]);
			return { ok: false, fixed: true, affectedappointmentid: result[0], appointmentnewtimerange: result[1] };
		}
	}
};

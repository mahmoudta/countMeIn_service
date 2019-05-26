const express = require("express");
let app = new express();
var Appointment = require('../../models/appointment');
const isEmpty = require('lodash/isEmpty');
const moment = require('moment');

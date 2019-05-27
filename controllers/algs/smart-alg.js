const express = require("express");
let app = new express();
var Appointment = require('../../models/appointment');
const isEmpty = require('lodash/isEmpty');
const moment = require('moment');

async function returnallappointmentsbybusiness(businessid){ 
    const appointments = await Appointment.find({business_id: businessid})
    return appointments;
 }
 async function apoin(businessid){ 
    const appointments = await Appointment.find({business_id: businessid})
    return appointments;
 }

 async function calculate(businessid){				
    var rate={
        sunday:{
            0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0  
        },
        monday:{
            0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0 
        },
        tuesday:{
            0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0  
        },
        wednesday:{
            0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0 
        },
        thursday:{
            0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0
        },
        friday:{
            0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0 
        },
        saturday:{
            0:0,1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0,13:0,14:0,15:0,16:0,17:0,18:0,19:0,20:0,21:0,22:0,23:0 
        }
    }
    const appointments = await returnallappointmentsbybusiness(businessid);
    appointments.forEach(function(oneappointment) {
        var tmpday=oneappointment.time.date.format('dddd').toLowerCase();
        var tmphour=oneappointment.time.start._hour;
        rate[tmpday][tmphour]++;
   });
    return rate;
 }

//module.exports = {}
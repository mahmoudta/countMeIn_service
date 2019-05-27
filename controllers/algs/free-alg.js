const express = require("express");
let app = new express();
var FreeTime = require('../../models/freeTime');
var Business = require('../../models/business');
var Appointment = require('../../models/appointment');
const util = require('util');
var inherits = require('util').inherits; 
const mongoose = require('mongoose');
const isEmpty = require('lodash/isEmpty');
const moment = require('moment');


/***********************************************************************************/
// Node class 
class Node 
{ 
    constructor(data) 
    { 
        this.data = data; 
        this.left = null; 
        this.right = null; 
    } 
}
/***********************************************************************************/
// Binary Search tree class 
class BinarySearchTree 
{ 
    constructor() 
    { 
        // root of a binary seach tree 
        this.root = null; 
        this.tmp_array=[];
        this.length = 0; 
    } 
   
    // helper method which creates a new node to  
    // be inserted and calls insertNode 
    insert(data) 
    { 
        // Creating a node and initailising  
        // with data  
        var newNode = new Node(data); 
                        
        // root is null then node will 
        // be added to the tree and made root. 
        if(this.root === null) {
            this.root = newNode; 
            this.length=1;
        }
        else{  
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
    insertNode(node, newNode) 
    { 
        // if the data is less than the node 
        // data move left of the tree  
        if( (newNode.data.end().hour()<node.data.start().hour()) || ( (newNode.data.end().hour()==node.data.start().hour()) && (newNode.data.end().minute()>=node.data.start().minute()) ) ) 
        { 
            // if left is null insert node here 
            if(node.left === null) {
                node.left = newNode; 
            }
            else{
                // if left is not null recurr until  
                // null is found 
                this.insertNode(node.left, newNode);  
            }
        } 
    
        // if the data is more than the node 
        // data move right of the tree  
        else
        { 
            // if right is null insert node here 
            if(node.right === null) {
                node.right = newNode; 
            }
            else{
                // if right is not null recurr until  
                // null is found 
                this.insertNode(node.right,newNode); 
            }
        } 
    } 
    // helper method that calls the  
    // removeNode with a given data 
    remove(data) 
    { 
        // root is re-initialized with 
        // root of a modified tree. 
        this.root = this.removeNode(this.root, data); 
        this.length--;
        return true;
    } 
  
    // Method to remove node with a  
    // given data 
    // it recurrs over the tree to find the 
    // data and removes it 
    removeNode(node, key) 
    { 
            
         // if the root is null then tree is  
         // empty 
        if(node === null) {
            return null; 
        }
            // if data is similar to the root's data  
            // then delete this node 
        else if( ( (key.end().hour()==node.data.end().hour()) && (key.end().minute()==node.data.end().minute()) ) && ( (key.start().hour()==node.data.start().hour()) && (key.start().minute()==node.data.start().minute()) ) )
        { 
            // deleting node with no children 
            if(node.left === null && node.right === null) 
            { 
                node = null; 
                return node; 
            } 
    
            // deleting node with one children 
            if(node.left === null) 
            { 
                node = node.right; 
                return node; 
            } 
            
            else if(node.right === null) 
            { 
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
        } 
        // if data to be delete is lesser than  
        // roots data then move to left subtree
        else if( (key.end().hour()<node.data.start().hour()) || ( (key.end().hour()==node.data.start().hour()) && (key.end().minute()>=node.data.start().minute()) ) ) 
        { 
            node.left = this.removeNode(node.left, key); 
            return node; 
        } 
    
        // if data to be delete is greater than  
        // roots data then move to right subtree 
        else if( (key.start().hour()<node.data.end().hour()) || ( (key.start().hour()==node.data.end().hour()) && (key.start().minute()>=node.data.end().minute()) ) ) 
        { 
            
            node.right = this.removeNode(node.right, key); 
            return node; 
        } 
        else{
            console.log("error in remove");
        }
  
    } 

    //  finds the minimum node in tree 
    // searching starts from given node 
    findMinNode(node) 
    { 
        // if left of a node is null 
        // then it must be minimum node 
        if(node.left === null) {
            return node; 
        }
        else{
            return this.findMinNode(node.left); 
        }
    } 
    //return array of strings
    arrayofopjects(){
        this.tmp_array=[];
        this.inorder(this.root,1);
        return this.tmp_array;

    }
    //return array of time_range opjects
    arrayofstrings(){
        this.tmp_array=[];
        this.inorder(this.root,0);
        return this.tmp_array;
        
    }
    //choice =0 when we want to save the tree as array of strings
    //choice =1 when we want to save the tree as array of time_range opjects
    inorder(node,choice) 
    { 
        if(node !== null) 
        { 
            this.inorder(node.left,choice); 
            if(choice==0)
            this.tmp_array.push(node.data.string());
            if(choice==1)
            this.tmp_array.push(node.data);
            this.inorder(node.right,choice); 
        } 
    } 
    totree(arr){
        this.root = null; 
        this.tmp_array=[];
        this.length = 0; 
        arr.forEach(timerange => {this.insert(timerange);});

    }
    getlength(){
        return this.length;
    }
    getRootNode(){
        return this.root;
    }
    search(node, data) 
    { 
    // if trees is empty return null 
        if(node === null){
            return null; 
        }
        // if data is equal to the node data  
        // return node 
        else if( ( (key.end().hour()==node.data.end().hour()) && (key.end().minute()==node.data.end().minute()) ) && ( (key.start().hour()==node.data.start().hour()) && (key.start().minute()==node.data.start().minute()) ) ){
            return node;
        } 
        // if data is less than node's data 
        // move left 
        else if( (key.end().hour()<node.data.start().hour()) || ( (key.end().hour()==node.data.start().hour()) && (key.end().minute()>=node.data.start().minute()) ) ){
            return this.search(node.left, data); 
        }
    
        // if data is greater than node's data 
        // move right 
        else if( (key.start().hour()<node.data.end().hour()) || ( (key.start().hour()==node.data.end().hour()) && (key.start().minute()>=node.data.end().minute()) ) ) {
            return this.search(node.right, data); 
        }
            
    }
    //check if the time range can be booked  
    ifcanbook(timerange,length,minutes_between_appointment){
       var timetobook;
       timetobook=length+minutes_between_appointment;
       if(timerange.tominutes()>=timetobook)
       return true;
       else
       return false;
    }
    //check if this timerange is within another timerange and book it
    ifinthetimerange(timerange,timerange_to_book){
        if( (timerange.start().hour()<timerange_to_book.start().hour()) || ( (timerange.start().hour()==timerange_to_book.start().hour()) && (timerange.start().minute()<=timerange_to_book.start().minute()) ) ){
            if( (timerange.end().hour()>timerange_to_book.end().hour()) || ( (timerange.end().hour()==timerange_to_book.end().hour()) && (timerange.end().minute()>=timerange_to_book.end().minute()) ) ){
            return true;
            }
        }
        return false;
    }
     //return the time ranges the can bee booked
    timerangesthatfit(length,minutes_between_appointment){
        var can_book=[];
        var free=[];
        free=this.arrayofopjects();

        free.forEach(timerange => {
            if(this.ifcanbook(timerange,length,minutes_between_appointment)){
                can_book.push(timerange);
            }
        });

        return can_book;
    }
    //book
    book(timerange_to_book){
        var checker=0
        var free=[];
        var lefttimerange;
        var righttimerange;
        free=this.arrayofopjects();
        free.forEach(timerange => {
            if(this.ifinthetimerange(timerange,timerange_to_book)){
                this.remove(timerange);
                lefttimerange=new time_range(timerange.start(),timerange_to_book.start());
                righttimerange=new time_range(timerange_to_book.end(),timerange.end());
                
                if(righttimerange.tominutes()>0){
                    if(lefttimerange.tominutes()>0){
                        //a
                        this.insert(lefttimerange);
                        this.insert(righttimerange);
                        checker=1;
                    }else{
                        //b
                        this.insert(righttimerange);
                        checker=1;
                    }

                }else{
                    if(lefttimerange.tominutes()>0){
                        //c
                        this.insert(lefttimerange);
                        checker=1;
                    }else{
                        //d
                        checker=1;
                    }

                }

            }
        
        });
        if(checker==1)
        return true;
        else
        return false;
        
        
    }

}
/***********************************************************************************/
//time_range opject
var time = function (hour,minute) {
    this._hour = hour;
    this._minute = minute;
};
time.prototype.hour = function () {
    return this._hour;
};
time.prototype.minute = function () {
    return this._minute;
};
time.prototype.string = function () {
    if(this._minute>9)
    return this._hour+":"+this._minute;
    else
    return this._hour+":"+"0"+this._minute;
};
time.prototype.add_and_return = function (minutes) {
    //this._hour+=( ((minutes+this._minute)/60) | 0 );
    //this._minute+=((minutes+this._minute)%60);
    return new time( this._hour+ ((minutes+this._minute)/60 | 0 ) ,(minutes+this._minute)%60);
};
time.prototype.ifbiggerthan = function (time) {
    
    // if this is greater than timerange
     if( (time.hour()<this.hour()) || ( (time.hour()==this.hour()) && (time.minute()<this.minute()) ) ) {
        return true;
    }else{
        return false;
    }

};
time.prototype.ifsmallerthan = function (time) {
        // if this is less than timerange
        if( (time.hour()>this.hour()) || ( (time.hour()==this.hour()) && (time.minute()>this.minute()) ) ) {
            return true;
        }else{
            return false;
        }
};

var time_range = function (start,end,value=0) {
    this._start = start;
    this._end = end;
    this._value=value;
};
time_range.prototype.start = function () {
    return this._start;
};
time_range.prototype.end = function () {
    return this._end;
};
time_range.prototype.string = function () {
    return this._start.string()+" - "+this._end.string();
};
time_range.prototype.tominutes = function () {
    var temp;
    temp=((this._end.hour()-this._start.hour())*60)+(this._end.minute()-this._start.minute());
    return temp;
};
time_range.prototype.slice = function (length,minutes_between_appointment) {
    var tmp=[];
    var sum=length+minutes_between_appointment;
    var i=0;
    var minutes=this.tominutes();
    for(i=0; sum*(i+1)<=minutes;i++){
        tmp.push( new time_range( this._start.add_and_return(sum*i),this._start.add_and_return(sum*(i+1)) )  );
    }
    return tmp;
};

function Day(date, free) {
	this.Date = date,
    this.Free=free
};
Day.prototype.slice = function (length,minutes_between_appointment) {
    var tmp=[];
    
    this.Free.forEach(timerange => {
        tmp=tmp.concat(timerange.slice(length,minutes_between_appointment));
    });
    this.Free=tmp;
};
 Day.prototype.mergewithcustomerandsave = async function  (customerappointment) {
    this.Free= await mergewithcostumer(this.Free,customerappointment,this.Date)
     
};
exports.time_range;

function diffDays(date_from, date_until) {
    var timeDiff = date_until.getTime() - date_from.getTime();
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays
};
//creat business and dates if not found and return the freeTime _id if the busness
async function creatifempty(businessid,workinghours,date_from,date_until){ 
    const newbusiness=await creatbusinessifempty(businessid);
    var freeobj;
    var free=[];
    var freeid;
    var daysnum=diffDays(date_from,date_until);
    for (var i = 0; i <= daysnum; i++) {
        
        freeobj = workinghours.filter(function(element) {
            if(element.opened){
                
            return element.day === moment(date_from).add(i, 'days').format('dddd').toLowerCase();
            }
            else
            return false;
         });
         
        if(isEmpty(freeobj)){
            continue;
         }
        free=[];
        freeobj.forEach(function(element) {
            if(!(element.break.isBreak)){
            from=new time(element.from.getHours(),element.from.getMinutes());
            until=new time(element.until.getHours(),element.until.getMinutes());
            free.push( new time_range(from , until ) ); 
            }else{
            from1=new time(element.from.getHours(),element.from.getMinutes());
            until1=new time(element.break.from.getHours(),element.break.from.getMinutes());
            free.push( new time_range(from1 , until1 ) ); 

            from2=new time(element.break.until.getHours(),element.break.until.getMinutes());
            until2=new time(element.until.getHours(),element.until.getMinutes());
            free.push( new time_range(from2 , until2 ) ); 

            }

        });
        freeid=await creatDateifempty(newbusiness.business_id,moment(date_from).add(i, 'days').format("YYYY/MM/DD"),free);

    }
if(!isEmpty(free))
return freeid;
return false;


}
async function creatbusinessifempty(businessid){ 
    //creatbusinessifempty
    const free=await FreeTime.findOne({business_id: businessid});
    //console.log(free);
        if(!isEmpty(free)) return free;
                    //console.log("business empty");
        const newfree = await FreeTime.create({ business_id: businessid });

        if(isEmpty(newfree)) return null;

        return newfree;
                
                
 } 
 async function creatDateifempty(businessid,oneDate,free){ 
    //creatDateifempty
    const curfree=await FreeTime.findOne({business_id: businessid})
    var or =curfree.dates.find(o => moment(o.day).format("YYYY/MM/DD")=== oneDate);
    var id=curfree._id;
    if(isEmpty(or)){
        await FreeTime.findById(id, function(err, FreeTime) {
            if (err) throw err;
            FreeTime.dates.push({ "day" : oneDate, "freeTime" : free })
            FreeTime.save(function(err) {
                if (err) throw err;     
                //FreeTime updated successfully
            });
        });
    }
    return id;
 }
 //choice=0 return the busness freetime slice it to slices /choice=1 choice=0 return the busness_freetime&costomer_freetime and slice it to slices/choice=2 only find free time of busness and return
 async function returnfreetime(id,services_length,minutes_between_appointment,appontments_number_to_return,date_from,date_until,choice,customerid,checkifcustomerhavebusness){ 
     if(id===false)
     return false
    var days=[];
    var tmp;
    var daysfree=[];
    var timeranges=[];
    var daysnum=diffDays(date_from,date_until);
    var customerappointment;
    var customersbusnessappointment;
    var customersbusness;
    if(choice==1||choice==3){
    customerappointment=await returnallappointmentsbycustomer(customerid);
    if(checkifcustomerhavebusness){
        
        customersbusness = await Business.findOne({owner_id: customerid})
        if(!isEmpty(customersbusness)){
        customersbusnessappointment=await returnallappointmentsbybusiness(customersbusness._id);
        }
    }
    
    }
    const freetime = await FreeTime.findById(id)
    mongodays=freetime.dates.filter(function(element) {
        return ( (0<=diffDays(element.day,date_until)) && (diffDays(element.day,date_until)<=daysnum) )

     });;
     
    mongodays.forEach(function(oneday) {
        freetobook=oneday.freeTime
        thedate=oneday.day
        timeranges=[];
        freetobook.forEach(function(onetimerange) {
            timeranges.push( new time_range(new time(onetimerange._start._hour,onetimerange._start._minute) , new time(onetimerange._end._hour,onetimerange._end._minute) ) );
        });
        days.push(new Day(thedate,timeranges));
    });
    var tmpday;
            var counter=0;
            var correcter=0;
            var tmpcorrector;
            var posibletobook = new BinarySearchTree();
            var day = new BinarySearchTree();

            do{
                if (days === undefined || days.length == 0) {break;}
                tmpday=days.shift();
                day.totree(tmpday.Free);
                posibletobook.totree(day.timerangesthatfit(services_length,minutes_between_appointment));
                ///call slicer at posibletobook
                counter+=posibletobook.getlength();
                if (counter>=appontments_number_to_return) {
                    correcter=counter-appontments_number_to_return
                    //tmpcorrector=posibletobook.arrayofstrings();
                    tmpcorrector=posibletobook.arrayofopjects();
                    for (; 0 < correcter; correcter--) { 
                        tmpcorrector.pop();
                    }
                    tmpday.Free=tmpcorrector;
                    
                    if(choice==1||choice==3){
                        await tmpday.mergewithcustomerandsave(customerappointment);
                        if( (checkifcustomerhavebusness) && (!isEmpty(customersbusness)) ){
                        await tmpday.mergewithcustomerandsave(customersbusnessappointment);
                        }
                    }
                    if(choice==0||choice==1)
                    tmpday.slice(services_length,minutes_between_appointment);
                    daysfree.push(tmpday);
                    break;
                }
                tmpday.Free=posibletobook.arrayofopjects();
                if(choice==1||choice==3){
                 await tmpday.mergewithcustomerandsave(customerappointment);
                 if( (checkifcustomerhavebusness) && (!isEmpty(customersbusness)) ){
                 await tmpday.mergewithcustomerandsave(customersbusnessappointment);
                 }
                }
                if(choice==0||choice==1)
                tmpday.slice(services_length,minutes_between_appointment);
                daysfree.push(tmpday)
            }while(counter<appontments_number_to_return);

return(daysfree);

}
async function mergetimerangelists(timerangelist1,timerangelist2,mergevalue,choice=0){ 
    // var i=0;
    // var j=0;
    var tempend;
    var tempstart;
    var result=[];
    if(choice==0)
    result=timerangelist1;
    // console.log("\n")
    // console.log(util.inspect(timerangelist1, {depth: null}));
    //  console.log(util.inspect(timerangelist2, {depth: null}));
    // console.log("\n")
    timerangelist2.forEach(function(fromtimerange2) {
        timerangelist1.forEach(function(fromtimerange1) {
                if( (fromtimerange1._start.ifsmallerthan(fromtimerange2._end))&& (fromtimerange1._end.ifbiggerthan(fromtimerange2._start))) {
                    if(fromtimerange1._start.ifbiggerthan(fromtimerange2._start)){
                        tempstart=fromtimerange1._start;
                    }
                    else{
                        tempstart=fromtimerange2._start;
                    }
        
                    if(fromtimerange1._end.ifsmallerthan(fromtimerange2._end)){
                        tempend=fromtimerange1._end;
                    }else{
                        tempend=fromtimerange2._end;
                    }
                    //console.log(util.inspect(result, {depth: null}));
                    result=result.filter(function(element) {
                        if( (element._start._hour==tempstart._hour) && (element._start._minute==tempstart._minute) && (element._end._hour==tempend._hour) && (element._end._minute==tempend._minute) )
                        return false;
                        else
                        return true;
                     });
                     
                    result.push(new time_range(tempstart,tempend,fromtimerange1._value+mergevalue));
                }
        });
      });
return result;
} 
async function returnallappointmentsbycustomer(customerid){ 
    const appointments = await Appointment.find({client_id: customerid})
    return appointments;

 }
 async function returnallappointmentsbybusiness(businessid){ 
    const appointments = await Appointment.find({business_id: businessid})
    return appointments;

 }
 async function mergewithcostumer(Free,appointments,oneDate){ 
    return await mergetimerangelists(Free, await returnfreeondate(appointments,oneDate),0,1);


 }
async function returnfreeondate(appointments,oneDate){ 
    var free=[];
    //console.log(oneDate)
    //console.log(util.inspect(appointments, {depth: null}));
    var appointmentsondate = appointments.filter(function(element) {
        if(moment(element.time.date).format("YYYY/MM/DD")=== moment(oneDate).format("YYYY/MM/DD"))
        return true;
        return false;
        
     });

     var day= new BinarySearchTree();
    day.totree([ new time_range(new time(0,0) , new time(24,0) ) ]);
    if(!isEmpty(appointmentsondate)){

     appointmentsondate.forEach(function(oneappointment) {
         var tmptime=new time_range( new time(oneappointment.time.start._hour,oneappointment.time.start._minute) , new time(oneappointment.time.end._hour,oneappointment.time.end._minute) )
         var result= day.book(tmptime) ;
        if(result==false)
        console.log("error on finding date on customer");

    });
    }   
    //console.log(util.inspect(day.arrayofopjects(), {depth: null}));
    return  day.arrayofopjects(); /* await pending */

 }
 async function mergewithbusnessbusnessbusyhour(businessid,freetime){ 

    var rate=await calculatebusnessbusyhours(businessid);
    //console.log(util.inspect(rate, {depth: null}));
    freetime.forEach(function(oneday) {
        var tmpdate=moment(oneday.Date).format('dddd').toLowerCase()
        oneday.Free.forEach(function(onetimerange) {
            var valuetoadd=0;
            var newvalue=0;
            var i;
            var start= onetimerange._start._hour;

            for (i = start; ((i <onetimerange._end._hour)||( (i==onetimerange._end._hour)&&(0<onetimerange._end._minute) )); i++) { 
                    valuetoadd+=(rate[tmpdate][i]);


            }
            if(valuetoadd!=0)
            newvalue=( 1/ ( valuetoadd/(i-start) ) );
            onetimerange._value+=newvalue;

        });
        

   });
   //console.log(util.inspect(rate, {depth: null}));
   return true;

 }

 async function calculatebusnessbusyhours(businessid){				
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
        var tmpdaybefore=oneappointment.time.date
        var tmpdayafter=moment(tmpdaybefore).format('dddd').toLowerCase();
        var tmphour=oneappointment.time.start._hour;
        rate[tmpdayafter][tmphour]++;
   });
    return rate;
 }

/***********************************************************************************/




        module.exports = {

            //in 'choice' you dicede if you want  0: the next number of 'days' or 1: spiceifec 'date'
            freeAlg: async (businessid,services,date_from,date_until,choice=0,customerid=0,appontments_number_to_return=7,checkifcustomerhavebusness=true)=>{
                var tempfreetime=[];
                const business = await Business.findOne({_id:businessid,'services.service_id':{$in: services.map(elem=>{return mongoose.Types.ObjectId(elem)})}})
                if(isEmpty(business))
                return({error :'invalid business'});

                    var services_length=0;
                    var services_cost=0;
                    business.services.forEach(function(oneservice) {
                        services_length+=oneservice.time;
                        services_cost+=oneservice.cost;
                    });
                    var minutes_between_appointment = business.break_time;
                    var workinghours =business.working_hours;
                    tempfreetime = await returnfreetime(await creatifempty(businessid,workinghours,date_from,date_until),services_length,minutes_between_appointment,appontments_number_to_return,date_from,date_until,choice,customerid,checkifcustomerhavebusness);
                //console.log(util.inspect(tempfreetime, {depth: null}));
                if( (tempfreetime===false) || (isEmpty(tempfreetime)) )
                return ({});
                return   tempfreetime;  
            },
            //to use after you book
            booked: async (businessid,chosendate,chosentimerange)=>{ 
            //console.log("booked");
            var resulte;
            var days=[];
            var tmpfree=[];
            var freetobook;
            var timeranges=[];
            const freetime = await FreeTime.findOne({business_id: businessid})
            if(isEmpty(freetime))
            return({error :'invalid business'});

            var daysinmongo =freetime.dates.find(o => moment(o.day).format("YYYY/MM/DD")=== moment(chosendate).format("YYYY/MM/DD"));
            var dateid=daysinmongo._id;
            var id=freetime._id;
            if(isEmpty(daysinmongo))
                return({error :'invalid Date'});
            else{
                //console.l]]]]og(daysinmongo);
                freetobook=daysinmongo.freeTime
                 timeranges=[];
                freetobook.forEach(function(onetimerange) {
                     timeranges.push( new time_range(new time(onetimerange._start._hour,onetimerange._start._minute) , new time(onetimerange._end._hour,onetimerange._end._minute) ) );
                });
            }
            days.push(new Day(chosendate,timeranges));
            //console.log(`before: ${chosentimerange}`)
            var tobook=  new time_range(new time(chosentimerange._start._hour,chosentimerange._start._minute) , new time(chosentimerange._end._hour,chosentimerange._end._minute) )
            //console.log("after"+tobook)
            var day= new BinarySearchTree();
            tmpfree=days.shift();
            day.totree(tmpfree.Free);
            try{
            resulte=day.book(tobook);
            }catch(error){
                console.log("invalid Time")
                return({error :'invalid Time'});
            }
            if(resulte){
                var newfreetime=day.arrayofopjects();
                
                await FreeTime.findById(id, function(err, freeTime) {
                    if (err) throw err;
                    var foundIndex = freeTime.dates.findIndex(o => moment(o.day).format("YYYY/MM/DD")=== moment(chosendate).format("YYYY/MM/DD"));
                    freeTime.dates[foundIndex].freeTime = newfreetime;
                    freeTime.save(function(err) {
                        if (err) throw err;     
                        //FreeTime updated successfully
                    });
                });

                ///////////////////////////////////////////////
                
                //console.log(newfreetime);
                return({answer : "done"});
            }else{
                return({error :'invalid Time'});
            }
                

            },
            ifcanbook: async (businessid,chosendate,chosentimerange)=>{ 
                var freeid;
                var result;
                var days=[];
                var timeranges=[];
                const business = await Business.findById(businessid)
                if(isEmpty(business)){
                    // console.log("wtf wrong with you...wrong business_id you either dont know the difference between business_id and owned_id or you are fucking with me");
                    return({error :'invalid business'});
                }else{
                    var workinghours =business.working_hours;
                    freeid =await creatifempty(businessid,workinghours,chosendate,chosendate);
                    if(freeid===false)
                    return false;
                    const freetime = await FreeTime.findOne({business_id: businessid})
                    var daysinmongo =freetime.dates.find(o => moment(o.day).format("YYYY/MM/DD")=== moment(chosendate).format("YYYY/MM/DD"));
                    freetobook=daysinmongo.freeTime
                     timeranges=[];
                     freetobook.forEach(function(onetimerange) {
                       timeranges.push( new time_range(new time(onetimerange._start._hour,onetimerange._start._minute) , new time(onetimerange._end._hour,onetimerange._end._minute) ) );
                     });
                    var tobook=  new time_range(new time(chosentimerange._start._hour,chosentimerange._start._minute) , new time(chosentimerange._end._hour,chosentimerange._end._minute) )
                    var day= new BinarySearchTree();
                    day.totree(timeranges);
                    result=await day.book(tobook);
        
                    return result;

                }
                
            },
            deleted: async (businessid,chosendate,chosentimerange)=>{ 
                const freetime = await FreeTime.findOne({business_id: businessid})
                if(isEmpty(freetime)){
                    return({error :'invalid business'});
                }
                    var id=freetime._id;
                    var daysinmongo =freetime.dates.find(o => moment(o.day).format("YYYY/MM/DD")=== moment(chosendate).format("YYYY/MM/DD"));
                    var freetobook=daysinmongo.freeTime
                     timeranges=[];
                     freetobook.forEach(function(onetimerange) {
                       timeranges.push( new time_range(new time(onetimerange._start._hour,onetimerange._start._minute) , new time(onetimerange._end._hour,onetimerange._end._minute) ) );
                     });
                    var tobook=  new time_range(new time(chosentimerange._start._hour,chosentimerange._start._minute) , new time(chosentimerange._end._hour,chosentimerange._end._minute) )
                    var day= new BinarySearchTree();
                    day.totree(timeranges);
                    result=await day.insert(tobook);
                     if(result){
                        await FreeTime.findById(id, function(err, freeTime) {
                            if (err) throw err;
                            var foundIndex = freeTime.dates.findIndex(o => moment(o.day).format("YYYY/MM/DD")=== moment(chosendate).format("YYYY/MM/DD"));
                            freeTime.dates[foundIndex].freeTime.push(tobook);
                            freeTime.save(function(err) {
                                if (err) throw err;     
                                //FreeTime updated successfully
                            });
                        });
                     }
                    return result;
                
            },
            smart: async (businessid,services,customerid,days_to_return=30,appontments_number_to_return=7)=>{ 
                
                var tempfreetime=[];
                const business = await Business.findOne({_id:businessid,'services.service_id':{$in: services.map(elem=>{return mongoose.Types.ObjectId(elem)})}})
                if(isEmpty(business))
                return({error :'invalid business'});

                    var services_length=0;
                    var services_cost=0;
                    business.services.forEach(function(oneservice) {
                        services_length+=oneservice.time;
                        services_cost+=oneservice.cost;
                    });
                    var minutes_between_appointment = business.break_time;
                    var workinghours =business.working_hours;

                var tmp=new Date();
                var date_from=new Date(tmp.getFullYear(),tmp.getMonth(),tmp.getDate());
                var date_until=moment(date_from).add(days_to_return, 'days').toDate();
                tempfreetime =await returnfreetime(await creatifempty(businessid,workinghours,date_from,date_until),services_length,minutes_between_appointment,appontments_number_to_return,date_from,date_until,3,customerid);
                afteraddedrate=await mergewithbusnessbusnessbusyhour(businessid,tempfreetime);
                //console.log(util.inspect(afteraddedrate, {depth: null}));
                if( (tempfreetime===false) || (isEmpty(tempfreetime)) )
                return ({});
                return   tempfreetime;
                //console.log(util.inspect(tempfreetime, {depth: null}));
                // var tmpfree=[];
                // tmpfree.push( new time_range(new time(8,0) , new time(9,45) ) );
                // tmpfree.push( new time_range(new time(11,0) , new time(12,0) ) );
                // tmpfree.push( new time_range(new time(12,40) , new time(14,0) ) );
                // tmpfree.push( new time_range(new time(14,30) , new time(15,0) ) );
                // tmpfree.push( new time_range(new time(15,0) , new time(18,0) ) );
                // console.log("\nfreetime :");
                // tmpfree.forEach(function(timerange) {
                //     console.log(timerange.string());
                // });
                // var free=[];
                // free.push( new time_range(new time(9,15) , new time(12,45) ) );
                // free.push( new time_range(new time(16,0) , new time(17,30) ) );
                // console.log("\nprevious appoitments ,value=1");
                // free.forEach(function(timerange) {
                //     console.log(timerange.string());
                // });
                // var morning=[];
                // morning.push( new time_range(new time(8,0) , new time(12,0) ) );
                // console.log("\nprefered time is morning(8:00-12:00),value=2 :\n");
                // var tmmp=[];
                // tmmp=await mergetimerangelists(tmpfree,free,1);
                // console.log("\nafter added previous appoitments :");
            
                // tmmp.forEach(function(timerange) {
                //     console.log(timerange.string()+" value="+timerange._value);
                // });
                // tmmp=await mergetimerangelists(tmmp,morning,2);
                // console.log("\nafter added that the prefered time is morning:");
                // tmmp.forEach(function(timerange) {
                //     console.log(timerange.string()+" value="+timerange._value);
                // });
                
            }
    



        };


        


    

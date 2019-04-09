const express = require("express");
let app = new express();
var FreeTime = require('../../models/freeTime');
var Business = require('../../models/business');

var inherits = require('util').inherits; 

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
        var checker=0;
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

        if(checker == 1)
        return true
        else
        return false
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

var time_range = function (start,end) {
    this._start = start;
    this._end = end;
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
	this.Free = free
};
Day.prototype.slice = function (length,minutes_between_appointment) {
    var tmp=[];
    this.Free.forEach(timerange => {
        tmp=tmp.concat(timerange.slice(length,minutes_between_appointment));
    });
    this.Free=tmp;
};
exports.time_range;
//creat business and dates if not found and return the freeTime _id if the busness
async function creatifempty(businessid,workinghours,days){ 
    await creatbusinessifempty(businessid);
    var freeobj;
    var free=[];
    for (var i = 0; i < days; i++) {
        freeobj = workinghours.filter(function(element) {
            if(element.opened)
            return element.day === moment().add(i, 'days').format('dddd').toLowerCase()
            else
            return false;
    
         });
        if(isEmpty(freeobj)){
            continue;
         }
        free=[];
        freeobj.forEach(function(element) {
            from=new time(element.from.getHours(),element.from.getMinutes());
            until=new time(element.until.getHours(),element.until.getMinutes());
            free.push( new time_range(from , until ) ); 
        });
        freeid=await creatDateifempty(businessid,moment().add(i, 'days').format("YYYY/MM/DD"),free);
    }

return freeid;
}
async function creatbusinessifempty(businessid){ 
    //creatbusinessifempty
    const free=await FreeTime.findOne({business_id: businessid})
    //console.log(free);
                if(isEmpty(free)){
                    //console.log("business empty");
                    FreeTime.create({ business_id: businessid }, function (err, free) {
                        if (err) return handleError(err);
                        // saved!
                      });
                    
                }else{
                    //business found
                    
                }
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
 async function returnfreetime(id,days,porpose_length,minutes_between_appointment,appontments_number_to_return){ 
    var days=[];
    var daysfree=[];
    var timeranges=[];
    const freetime = await FreeTime.findById(id)
    mongodays=freetime.dates;
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
                posibletobook.totree(day.timerangesthatfit(porpose_length,minutes_between_appointment));
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
                    tmpday.slice(porpose_length,minutes_between_appointment);
                    daysfree.push(tmpday);
                    break;
                }
                tmpday.Free=posibletobook.arrayofopjects();
                tmpday.slice(porpose_length,minutes_between_appointment);
                daysfree.push(tmpday)
            }while(counter<appontments_number_to_return);

return(daysfree);

}
/***********************************************************************************/



        // exports.freeTimeAlg = (businessid,purpose_id)=>{

        //     console.log("free Time");
        //     var days=[];
        //     var daysfree=[];
        //     /////////////////////////////////////////////////
        //     var day1 = new BinarySearchTree();
        //     day1.insert( new time_range(new time(8,0) , new time(9,45) ) );
        //     day1.insert( new time_range(new time(11,0) , new time(12,0) ) );
        //     day1.insert( new time_range(new time(12,40) , new time(14,0) ) );
        //     day1.insert( new time_range(new time(14,30) , new time(15,0) ) );
        //     day1.insert( new time_range(new time(15,0) , new time(18,0) ) );
        //     console.log("3/4/2019 : "+day1.arrayofstrings());
        //     days.push(new Day(new Date(2019, 3, 4),day1.arrayofopjects()));
        //     /////////////////////////////////////////////////
        //     var day2 = new BinarySearchTree();
        //     day2.insert( new time_range(new time(8,45) , new time(14,0) ) );
        //     day2.insert( new time_range(new time(14,30) , new time(18,0) ) );
        //     console.log("4/4/2019 : "+day2.arrayofstrings());
        //     days.push(new Day(new Date(2019, 3, 5),day2.arrayofopjects()));
        //     /////////////////////////////////////////////////
        //     var day3 = new BinarySearchTree();
        //     day3.insert( new time_range(new time(8,0) , new time(18,0) ) );
        //     console.log("5/4/2019 : "+day3.arrayofstrings());
        //     days.push(new Day(new Date(2019, 3, 6),day3.arrayofopjects()));
        //    /////////////////////////////////////////////////
        //     //i need busnees id and the porpose id
        //     //var days=[];      //from freetime database of the busnese (should be sorted if posible)
        //     var porpose_length=60;  //porpose lenth acording to the main bussnese database
        //     console.log("porpose leanght="+porpose_length);
        //     var minutes_between_appointment=5;//minutes between appointment acording to the main bussnese database
        //     console.log("minutes between appointmen="+minutes_between_appointment);
        //     var appontments_number_to_return=6;//number of appointment to return
        //     console.log("number of appointment to return="+appontments_number_to_return);
        //     var tmpday;
        //     var counter=0;
        //     var correcter=0;
        //     var tmpcorrector;
        //     var posibletobook = new BinarySearchTree();
        //     var day = new BinarySearchTree();
        //     do{
        //         if (days === undefined || days.length == 0) {break;}
        //         tmpday=days.shift();
        //         day.totree(tmpday.Free);
        //         posibletobook.totree(day.timerangesthatfit(porpose_length,minutes_between_appointment));
        //         ///call slicer at posibletobook
        //         counter+=posibletobook.getlength();
        //         if (counter>=appontments_number_to_return) {
        //             correcter=counter-appontments_number_to_return
        //             //tmpcorrector=posibletobook.arrayofstrings();
        //             tmpcorrector=posibletobook.arrayofopjects();
        //             for (; 0 < correcter; correcter--) { 
        //                 tmpcorrector.pop();
        //             }
        //             tmpday.Free=tmpcorrector;
        //             tmpday.slice(porpose_length,minutes_between_appointment);
        //             daysfree.push(tmpday);
        //             break;
        //         }
        //         tmpday.Free=posibletobook.arrayofopjects();
        //         tmpday.slice(porpose_length,minutes_between_appointment);
        //         daysfree.push(tmpday)
        //     }while(counter<appontments_number_to_return);
        //     console.log("answer sent");

        //     return(daysfree);
        // };

        // exports.booked = (businessid,timerange)=>{

        //     console.log("booked");
        //     /////////////////////////////////////////////////
        //     var days=[];
        //     var tmpfree=[];
        //     var day1 = new BinarySearchTree();
        //     day1.insert( new time_range(new time(8,0) , new time(9,45) ) );
        //     day1.insert( new time_range(new time(11,0) , new time(12,0) ) );
        //     day1.insert( new time_range(new time(12,40) , new time(14,0) ) );
        //     day1.insert( new time_range(new time(14,30) , new time(15,0) ) );
        //     day1.insert( new time_range(new time(15,0) , new time(18,0) ) );
        //     console.log("3/4/2019 : "+day1.arrayofstrings());
        //     days.push(new Day(new Date(2019, 3, 4),day1.arrayofopjects()));
        //     /////////////////////////////////////////////////
        //     //take from database days in spicific date
        //     //want to book between 9:00 to 9:20
        //     var tobook= new time_range(new time(9,0) , new time(9,20) );
        //     var day= new BinarySearchTree();
        //     tmpfree=days.shift();
        //     day.totree(tmpfree.Free);
        //     day.book(tobook);
        //     console.log(day.arrayofstrings());
        //     var date = new Date();
        //     console.log(date);
        //     return("done");
        // };

        module.exports = {

            //in 'choice' you dicede if you want  0: the next number of 'days' or 1: spiceifec 'date'
            freeAlg: async (businessid,purposeid,days,choice,date)=>{
                var toreturn;
                const business = await Business.findById(businessid)
                if(isEmpty(business)){
                    // console.log("wtf wrong with you...wrong business_id you either dont know the difference between business_id and owned_id or you are fucking with me");
                    return({error :'invalid business'});
                }else{
                    var porpose_length = business.profile.purposes.find(o => o.purpose_id === purposeid).time;
                    var minutes_between_appointment = business.profile.break_time;
                    var workinghours =business.profile.working_hours;
                    var appontments_number_to_return=6 //number of appointment to return
                }
                

                switch(choice) {
                    case 0:
                      //console.log(await creatifempty(businessid,workinghours,days))
                      toreturn =await returnfreetime(await creatifempty(businessid,workinghours,days),days,porpose_length,minutes_between_appointment,appontments_number_to_return)
                      break;
                    case 1:
                      console.log("my bad...choice 1 is not finished yet try choice 0, works fine");
                      break;
                    default:
                      console.log("wrong choice...read the instructions");
                  }
                

                // add a day
                
                //console.log(toreturn)
                return toreturn;
            },
            //to use after you book
            booked: async (businessid,chosendate,chosentimerange)=>{ 
            //console.log("booked");
            var resulte;
            var days=[];
            var tmpfree=[];
            var timeranges=[];
            const freetime = await FreeTime.findOne({business_id: businessid})
            var daysinmongo =freetime.dates.find(o => moment(o.day).format("YYYY/MM/DD")=== moment(chosendate).format("YYYY/MM/DD"));
            var dateid=daysinmongo._id;
            var id=freetime._id;
            if(isEmpty(daysinmongo)){
                console.log("date not found");
                    return({answer : "fuck you"})
            }
            else{
                //console.log(daysinmongo);
                freetobook=daysinmongo.freeTime
                 timeranges=[];
                freetobook.forEach(function(onetimerange) {
                     timeranges.push( new time_range(new time(onetimerange._start._hour,onetimerange._start._minute) , new time(onetimerange._end._hour,onetimerange._end._minute) ) );
                });
            }
            days.push(new Day(chosendate,timeranges));
            var tobook=  new time_range(new time(chosentimerange._start._hour,chosentimerange._start._minute) , new time(chosentimerange._end._hour,chosentimerange._end._minute) )
            var day= new BinarySearchTree();
            tmpfree=days.shift();
            day.totree(tmpfree.Free);
            resulte=day.book(tobook);
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
                return({answer : "failed"});
            }
                

            }



        };


        


    

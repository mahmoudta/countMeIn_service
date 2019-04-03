const express = require("express");
let app = new express();
var inherits = require('util').inherits; 
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
                    }else{
                        //b
                        this.insert(righttimerange);
                    }

                }else{
                    if(lefttimerange.tominutes()>0){
                        //c
                        this.insert(lefttimerange);
                    }else{
                        //d
                    }

                }

            }
        
        });
        
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
/***********************************************************************************/



        exports.freeTimeAlg = (business_id,purpose_id)=>{

            console.log("free Time");
            var days=[];
            var daysfree=[];
            /////////////////////////////////////////////////
            var day1 = new BinarySearchTree();
            day1.insert( new time_range(new time(8,0) , new time(9,45) ) );
            day1.insert( new time_range(new time(11,0) , new time(12,0) ) );
            day1.insert( new time_range(new time(12,40) , new time(14,0) ) );
            day1.insert( new time_range(new time(14,30) , new time(15,0) ) );
            day1.insert( new time_range(new time(15,0) , new time(18,0) ) );
            console.log("27/03/2019 : "+day1.arrayofstrings());
            days.push(new Day(new Date(2019, 2, 28),day1.arrayofopjects()));
            /////////////////////////////////////////////////
            var day2 = new BinarySearchTree();
            day2.insert( new time_range(new time(8,45) , new time(14,0) ) );
            day2.insert( new time_range(new time(14,30) , new time(18,0) ) );
            console.log("28/03/2019 : "+day2.arrayofstrings());
            days.push(new Day(new Date(2019, 2, 29),day2.arrayofopjects()));
            /////////////////////////////////////////////////
            var day3 = new BinarySearchTree();
            day3.insert( new time_range(new time(8,0) , new time(18,0) ) );
            console.log("29/03/2019 : "+day3.arrayofstrings());
            days.push(new Day(new Date(2019, 2, 30),day3.arrayofopjects()));
           /////////////////////////////////////////////////
            //i need busnees id and the porpose id
            //var days=[];      //from freetime database of the busnese (should be sorted if posible)
            var porpose_length=60;  //porpose lenth acording to the main bussnese database
            console.log("porpose leanght="+porpose_length);
            var minutes_between_appointment=5;//minutes between appointment acording to the main bussnese database
            console.log("minutes between appointmen="+minutes_between_appointment);
            var appontments_number_to_return=6;//number of appointment to return
            console.log("number of appointment to return="+appontments_number_to_return);
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
            console.log("answer sent");

            return(daysfree);
        }

        exports.booked = (business_id,timerange)=>{

            console.log("free Time");
            /////////////////////////////////////////////////
            var days=[];
            var tmpfree=[];
            var day1 = new BinarySearchTree();
            day1.insert( new time_range(new time(8,0) , new time(9,45) ) );
            day1.insert( new time_range(new time(11,0) , new time(12,0) ) );
            day1.insert( new time_range(new time(12,40) , new time(14,0) ) );
            day1.insert( new time_range(new time(14,30) , new time(15,0) ) );
            day1.insert( new time_range(new time(15,0) , new time(18,0) ) );
            console.log("27/03/2019 : "+day1.arrayofstrings());
            days.push(new Day(new Date(2019, 2, 28),day1.arrayofopjects()));
            /////////////////////////////////////////////////
            //take from database days in spicific date
            //want to book between 9:00 to 9:20
            var tobook= new time_range(new time(9,0) , new time(9,20) );
            var day= new BinarySearchTree();
            tmpfree=days.shift();
            day.totree(tmpfree.Free);
            day.book(tobook);
            console.log(day.arrayofstrings());
            return("done");
        }


    

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
        }
        else{  
            // find the correct position in the  
            // tree and add the node 
            this.insertNode(this.root, newNode); 
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

        arr.forEach(timerange => {this.insert(timerange);});

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
    chose(timerange,length){

    }
    book(timerange){

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
    return this._hour+":"+this._minute
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

exports.time_range;
/***********************************************************************************/
// app.get("/algs/freealg", function (req, res) {
    // module.exports ={

    
    //in:: the porpose and the schadule of the client and the schadule of the bussnes
    //for test




        exports.freeTimeAlg = (business_id)=>{

            console.log("free Time");
            var free1=[];
            var day1 = new BinarySearchTree();
            day1.insert( new time_range(new time(9,0) , new time(9,45) ) );
            day1.insert( new time_range(new time(8,0) , new time(9,0) ) );
            day1.insert( new time_range(new time(11,0) , new time(12,0) ) );
            console.log(day1.arrayofstrings());
            free1=day1.arrayofopjects();
            /////////////////////////////////////////////////
            var free2=[];
            var day2 = new BinarySearchTree();
            day2.totree(free1);
            day2.remove( new time_range(new time(9,0) , new time(9,45) ) );
            free2=day2.arrayofopjects();
            return(day2.arrayofstrings());
        }



    
    //res.json({ message: welcome to the `api!' });

// let port = 8080;
// app.listen(port, function() {
//     console.log("Server started listening at localhost:" + port);
// });

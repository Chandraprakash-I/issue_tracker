'use strict';
const User=require('../models/userModel');
module.exports = function (app) {

  app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let refobj={
        "assigned_to": "",
        "status_text": "",
        "open": false,
        "_id": "64fd51f36dd241085bc26b9a",
        "issue_title": "1111",
        "issue_text": "1111",
        "created_by": "icp",
        "created_on": "2023-09-10T05:19:47.802Z",
        "updated_on": "2023-09-11T06:24:25.114Z"
        }
      console.log(req.query);
      let k=Object.keys(req.query);
      console.log(k);
      let search={};
      for (let i=0; i<k.length; i++){
        if(refobj.hasOwnProperty(k[i]) &&req.query[k[i]] !== false&& req.query[k[i]] !== '' ){
          console.log(k[i]);
          search[k[i]]=req.query[k[i]]; 
        }
      }
      console.log('search:'+search);
      console.log('get request');
      let project = req.params.project;
      search.params=project
      User.find(search,'-__v -params').then((data,err) => {
          if(err){
            console.log(err);
          }
          res.send(data); 
      })
    })
    
    .post(function (req, res){
      console.log('post received.');
      let output='k';
      let project = new User(req.body);
      console.log('params:'+req.params.project);
      project.params=req.params.project;
      console.log(project);
      project.save().then((user,err) => {
        if(err) return console.log('error bitch');
       
        User.findById(user._id).select('-__v -params').exec().then((user,err) => {
          if (err) {
            console.log('error:'+err);
            
          } else {
            res.send(user); 
          }
          
        });
       
      }).catch((err) => {
         
          output={ error: 'required field(s) missing' };
          console.log('its here right'+err);
          res.send(output);
        
      });
     
    })
    
    .put(function (req, res){
      
      let project = req.body;
      // console.log('Inside put: '+req.body); 
     
      let output='';
   
      console.log('project'+req.body.data);
      console.log()
      if(project._id === '' && project.issue_title === '' && project.issue_text === '' && project.created_by === '' && project.assigned_to === '' && project.status_text === ''){
        console.log('kkkk');
        return res.send({ error:  'missing _id' });
 
      }
      if(project._id === ''){
        return res.send({ error: 'missing _id' });
      }

      const updateFunction=  () => {
        let user={};
       
        let arr=Object.keys(project);
        console.log(arr);
        console.log(project.open);
        for(let i=0; i<arr.length; i++){
            if(arr[i] === '_id' || project[arr[i]]=== "" || project[arr[i]]=== false){
              continue;
            }
            user[arr[i]]=project[arr[i]];

        }
        user.updated_on=Date.now()
        return user;
      }
      let update=updateFunction();
      console.log(update);
       
      if(Object.keys(update).length === 1 && update.hasOwnProperty('updated_on')){
        return res.send({ error: 'no update field(s) sent', '_id': project._id });
      }

      User.findOneAndUpdate({_id: project._id}, update, { new: true })
      .then(updatedUser => {
        output={result: 'successfully updated',_id: updatedUser._id};
        res.send(output); // This will log the updated document
      })
      .catch(err => {
        res.send({ error: 'could not update', '_id': project._id });
        console.log('error bitch');
      });
        

      
    
    })
    
    .delete(function (req, res){
      let project = req.body;
      console.log(req.body._id === '')
      if(req.body._id === ''){
        return res.send({ error: 'missing _id' });
      }else{

        User.findByIdAndDelete(req.body._id).then((deletedUser) => {

          res.send({ result: 'successfully deleted', '_id': deletedUser._id });
        
      }).catch((err) => {
       
        res.send({ error: 'could not delete', '_id': req.body._id });
      });
      }
      
      
    });
    
};

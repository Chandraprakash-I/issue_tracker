const mongoose=require('mongoose');

const userSchema = new mongoose.Schema({
    params: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    issue_text: {
        type: String,
        required: true
    },
    created_by:{
      type: String,
      required: true
    },
    assigned_to: {
      type: String,
      default: ''
    },
    status_text: {
      type: String,
      default: ''
    },
    open: {
      type: Boolean, 
      default: true
  },
  issue_title: {
      type: String,
      required: true 
  },
  created_on: {
        type: Date,
        default: Date.now // Set default value to the current date and time
  },
  updated_on: {
        type: Date,
        default: Date.now// Set default value to the current date and time
  }
 
  });
  const User=mongoose.model('User',userSchema);

module.exports=User;
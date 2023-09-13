const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { deleteOne } = require('../models/userModel');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  test('Create an issue with every field: POST request to',function(done){
    let issue={
        issue_text: '9',
        created_by:'8',
        assigned_to:'7',
        status_text:'6',
        issue_title:'icp'
    }
    chai.request(server)
    .post('/api/issues/apitest')
    .query(issue)
    .end(function(err, res) {
        console.log(res);
        assert.equal(res.status,200);
        assert.equal(res.text,'{"error":"required field(s) missing"}');
        done();
    })
    
  });

  test('Create an issue with only required fields: POST request to /api/issues/apitest',function(done){
    let issue={
        issue_title:'icp',
        issue_text: '9',
        created_by:'8',
    }
    chai.request(server)
    .post('/api/issues/apitest')
    .query(issue)
    .end(function(err, res) {
        console.log(res);
        assert.equal(res.status,200);
        assert.equal(res.body,'{"assigned_to":"","status_text":"","open":true,"_id":"650158ff5be06508b155a397","issue_title":"icp","issue_text":"9","created_by":"8","created_on":"2023-09-13T06:38:55.708Z","updated_on":"2023-09-13T06:38:55.708Z"}');
        done();
    })
    
  });
});

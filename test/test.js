const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const should = chai.should();

const {DATABASE_URL} = require('../config');
const {BlogPost} = require('../models');
const {closeServer, runServer, app} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
chai.use(chaiHttp);







function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err))
  });
};



function seedBlogPostData() {
  console.info('seeding blog post data');
  const seedData = [];
  for (let i=1; i<=10; i++) {
    seedData.push({
      author: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
      title: faker.lorem.sentence(),
      content: faker.lorem.text()
    });
  };
  // this will return a promise
  return BlogPost.insertMany(seedData);
}

function generateBlogpost() {
  return {
    author: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    },
    title: faker.lorem.sentence(),
    content: faker.lorem.text()
  }
}



// describe('blog posts API resource', function() {

  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedBlogPostData();
  });

  // afterEach(function() {
  //   // tear down database so we ensure no state from this test
  //   // effects any coming after.
  //   return tearDownDb();
  // });
  //
  // after(function() {
  //   return closeServer();
  // });

// });





describe('testing the GET endpoint', function() {

    it('getting all objects back', function() {
        let res;
        return chai.request(app)
        .get('/posts')
        .then(function(_res) {
             res = _res;
           res.should.have.status(200);
	         res.body.should.have.length.of.at.least(1);
	         return BlogPost.count();
        })
        .then(function(count) {
            res.body.should.have.length.of(count);
        });
    });
});

    it('checking Get request using path Varible', function() {
      let post;
      return BlogPost
      .findOne()
      .exec()
      .then(function(_res) {
      // console.log(_res);
        post = _res
        return chai.request(app)
        .get(`/posts/${post.id}`)
      })
      .then(function(res) {
        res.body.id.should.equal(post.id);
        res.should.have.status(200)
      })

    });

describe('test POST endpoint', function() {

  it('should add a new blogpost', function() {

    const testBlogpost = generateBlogpost()

    return chai.request(app)
    .post('/posts')
    .send(testBlogpost)
    .then(function(res) {
      res.should.have.status(201)
      res.should.be.json
      res.body.should.be.a('object')
      console.log(res.body.id)
    })
  })
})

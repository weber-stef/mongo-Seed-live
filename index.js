const mongoose = require("mongoose");
const faker = require("faker");

const express = require("express");
const exphbs = require('express-handlebars');
const path = require('path');


const UserModel = require("./models/user");

mongoose.connect("mongodb://localhost:27017/seed-test", {
    useNewUrlParser: true,
    useCreateIndex: true
});

const db = mongoose.connection;

const createFakeUsers = (amount = 5) =>
    new Array(amount).fill(0).map(() => ({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        age: Math.floor(Math.random() * 70 + 18),
        username: faker.internet.userName(),
        short_bio: faker.lorem.text(),
        address: {
            street: faker.address.streetName(),
            street_number: Math.floor(Math.random() * 7000 + 0),
            zip: faker.address.zipCode(),
            city: faker.address.city(),
            country: faker.address.country()
        },
        phone_number: faker.phone.phoneNumber()
    }));

const main = async () => {
    await db.dropCollection("users");
    const fakeUser = createFakeUsers(10);
    const fakeUserModels = fakeUser.map(user => new UserModel(user).save());

    await Promise.all(fakeUserModels);
    console.log("Seed completed");



    /* Show the data on localhost:3001 */
    console.log("API works http://localhost:3001");

    const app = express()

    //ADD SETUP FOR express-handlebars

    app.engine('handlebars', exphbs())
    app.set('view engine', 'handlebars');
    app.set('views', path.join(__dirname, './views'))


    app.get('/', async (req, res) => {
        const users = await UserModel.find({}).exec({})
        console.log("You're on home")
        // Here it changes -> View Engine (Handlebars)
        res.render('home', { users: users, title: "Homepage" })
    })

    app.get('/api', async (req, res) => {
        /* Pull data from DB */
        const users = await UserModel.find({}).exec({})
        res.json(users)
    })

    app.get('/users/:userId', async (req, res) => {
        // get the params -> _id
        const userId = req.params.userId;
        //fetch from the DB this user only (mongoose)
        const user = await UserModel.findById(userId).exec({})
        console.log(user)
        //pass it to the view
        res.render('user', { user: user, title: "Single user" })
    })

    await app.listen(3001)





    //process.exit(0);
};

main();

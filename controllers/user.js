const faker = require("faker");
const UserModel = require("../models/user")

exports.create = (amount = 5) =>
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
            country: faker.address.country(),
            state: faker.address.state()
        },
        phone_number: faker.phone.phoneNumber()
    }));

// add user to db
exports.addUser = async (req, res) => {

    console.log('post received');

    const user = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: {
            city: req.body.city,
            country: "Germany"
        }
    }
    const newUser = await new UserModel(user).save().then(() => {
        console.log('user added correctly');
    }).catch(err => { console.error(err) })

}

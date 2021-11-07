const express = require('express');
const mongoose = require('mongoose');
const cities = require('./cities');
const {
    places,
    descriptors
} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database succesfully connected!');
})

const getRand = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const randomLocation = getRand(cities);
        const price = Math.floor(Math.random() * 30) + 20;
        const camp = new Campground({
            location: `${randomLocation.city}, ${randomLocation.state}`,
            title: `${getRand(descriptors)} ${getRand(places)}`,
            author: '61014398c68c1539ffd213f2',
            geometry: { type: "Point", coordinates: [randomLocation.longitude, randomLocation.latitude] },
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Iste dignissimos fugit omnis, tenetur perferendis, placeat aut atque aliquid libero saepe consequatur ratione necessitatibus eum illum. Distinctio dignissimos id corporis at.',
            price,
            images: [
                {
                    "url": "https://res.cloudinary.com/dcf6kkgpj/image/upload/v1627564204/YelpCamp/uokfuujydtjv78n9r4ua.jpg",
                    "filename": "YelpCamp/uokfuujydtjv78n9r4ua"
                },
                {
                    "url": "https://res.cloudinary.com/dcf6kkgpj/image/upload/v1627564203/YelpCamp/gkjgymkoyrfg8nqww0fg.jpg",
                    "filename": "YelpCamp/gkjgymkoyrfg8nqww0fg"
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});
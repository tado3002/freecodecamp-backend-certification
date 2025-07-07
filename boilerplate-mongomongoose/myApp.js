require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
  },
  favoriteFoods: {
    type: [String],
  },
});

let Person;
Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  const person = new Person({
    name: "tado",
    age: 21,
    favoriteFoods: ["Martabak", "Mie Instant"],
  });
  person.save().then((doc) => {
    console.log(doc);
    done(null, doc);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  const people = Person.create(arrayOfPeople);
  people.then((doc) => {
    console.log(doc);
    done(null, doc);
  });
};

const findPeopleByName = (personName, done) => {
  const person = Person.find({
    name: personName,
  });
  person.then((doc) => {
    console.log(doc);
    done(null, doc);
  });
};

const findOneByFood = (food, done) => {
  const person = Person.findOne({
    favoriteFoods: food,
  });
  person.then((doc) => {
    console.log(doc);
    done(null, doc);
  });
};

const findPersonById = (personId, done) => {
  const person = Person.findById(personId);
  person.then((doc) => {
    console.log(doc);
    done(null, doc);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, person) => {
    if (err) return console.log(err);
    person.favoriteFoods.push(foodToAdd);
    person.save((err, doc) => {
      if (err) return console.log(err);
      console.log(doc);
      done(null, doc);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    {
      name: personName,
    },
    { age: ageToSet },
    { new: true }
  ).then((doc) => {
    done(null, doc);
  });
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId).then((doc) => {
    console.log(doc);
    done(null, doc);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({
    name: nameToRemove,
  }).then((doc) => {
    done(null, doc);
  });
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({ favoriteFoods: foodToSearch })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec((err, person) => done(null, person));
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;

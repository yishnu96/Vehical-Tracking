const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const location = Schema({
    latitude: String,
    longitude: String,
    at: { type: Date, default: Date.now },
}, {
    versionKey: false,
    _id: false
})


const locationSchema = new Schema({
    coordinates: [location],
    vehicle: { type: Schema.Types.ObjectId, ref: "vehicle" },
    date: { type: Date, default: Date }
},
    { versionKey: false });


module.exports = mongoose.model('location', locationSchema);
// module.exports {
//   mongoose.model('location', locationSchema);
//   mongoose.model('coodinates', location);
// }

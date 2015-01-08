var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var heroSchema = new Schema({
    index: {type: Number},
    level: {type: Number, default: 1},
    exp: {type: Number, default: 0}
},{_id:false});
heroSchema.index({index: 1});
var UserSchema = new Schema({
    email:{type:String},
    pass:{type:String},
    channel:{type:String},
    client_version:{type:String},
    device_id:{type:String},
    name:{type:String},
    diamond:{type:Number, default: 100},
    blue_cost:{type:Number, default: 100},
    yellow_cost:{type:Number, default: 100},
    taskProcess: {type: Number, default: 1},
    energy:{type: Schema.Types.Mixed, default: {lastTime: 0, value: 10}},
    created:{type: Date, default: Date.now},
    hero: [heroSchema]
});

UserSchema.index({device_id: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});
UserSchema.index({name: 1}, {unique: true});

mongoose.model('User', UserSchema);       
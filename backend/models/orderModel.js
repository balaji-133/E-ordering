// import mongoose from 'mongoose';
// const orderSchema = new mongoose.Schema({
//     userId:{type:String,required:true},
//     items:{type:Array,required:true},
//     amount:{type:Number,required:true},
//     name: {
//         type: String,
//         required: true,
//         trim: true
//       },
//       table: {
//         type: String,
//         enum: ['table-1', 'table-2', 'table-3', 'table-4', 'table-5', 'table-6'],
//       },
//       people: {
//         type: Number,
//         enum: [1, 2, 3, 4, 5, 6],
//       },
//       status:{type:String,default:"Processing"},
//       date:{type:Date,default:Date.now()},
//       payment:{type:Boolean,default:false}
// })

// const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

// export default orderModel;
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    table: {
        type: String,
        required: true,
        enum: ['table-1', 'table-2', 'table-3', 'table-4', 'table-5', 'table-6'],
    },
    people: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4, 5, 6],
    },
    status: {
        type: String,
        default: "Processing"
    },
    date: {
        type: Date,
        default: Date.now
    },
    payment: {
        type: Boolean,
        default: false
    }
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
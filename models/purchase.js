const mongoose=require ("mongoose");



const purchaseSchema = new mongoose.Schema({
  email: String,
  payment_id: String,
  razorpay_order_id: String,
  files: [String],
  amount: Number,
  createdAt: { type: Date, default: Date.now }
});
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports= Purchase;
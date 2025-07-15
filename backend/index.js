const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const AuthRoute = require("./routes/Auth.route")
const AdminRoute = require("./routes/Admin.route")
const CatRoute  = require("./routes/category.route")
const ProductRoute  = require("./routes/product.route")
const CartRoute  = require("./routes/Cart.route")
const BannerRoute  = require("./routes/Banner.route")
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/payment.routes")
const wishlistRoute = require('./routes/Wishlist.route');
const contactRoutes = require('./routes/contact.route');

dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(cors({
//     origin: "*", // Specific origin
//     credentials: true // Allow credentials
//   }));
const allowedOrigins = ['http://localhost:5173', 'http://localhost:3000',  'https://jewels-ecommerce-frontend.onrender.com',
  'https://jewels-ecommerce-admin.onrender.com']

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))

app.use("/api/auth/",AuthRoute)
app.use("/api/category/",CatRoute)
app.use("/api/admin/",AdminRoute)
app.use("/api/product/",ProductRoute)
app.use("/api/cart/",CartRoute)
app.use("/api/banners/",BannerRoute)
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use('/api/wishlist', wishlistRoute);
app.use("/api/", contactRoutes); // 👈 Use

// app.use("/api/payment", PaymentRoute);


require("./config/db").main()
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const port = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
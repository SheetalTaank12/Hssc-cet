// app.js - handles routes + free + paid (with Razorpay) downloads
const express = require("express");
const path = require("path");
const fs = require("fs");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

const Purchase = require("./models/purchase"); // import Purchase model
dotenv.config();

const app = express();

// ---------- View Engine ----------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ---------- Middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---------- Razorpay Instance ----------
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ---------- ROUTES ----------

// Redirect root → /notes
app.get("/", (req, res) => res.redirect("/notes"));

// ---------- Pages with try-catch ----------
app.get("/notes", (req, res) => {
  try { res.render("index.ejs"); }
  catch (err) { console.error(err); res.status(500).send("Error loading page"); }
});

app.get("/notes/about", (req, res) => {
  try { res.render("about.ejs"); }
  catch (err) { console.error(err); res.status(500).send("Error loading page"); }
});

app.get("/notes/samplenotes", (req, res) => {
  try { res.render("notes.ejs"); }
  catch (err) { console.error(err); res.status(500).send("Error loading page"); }
});

app.get("/notes/offers", (req, res) => {
  try {
    res.render("offers.ejs", { RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading page");
  }
});

app.get("/notes/reviews", (req, res) => {
  try { res.render("reviews.ejs"); }
  catch (err) { console.error(err); res.status(500).send("Error loading page"); }
});

app.get("/notes/contact", (req, res) => {
  try { res.render("contact.ejs"); }
  catch (err) { console.error(err); res.status(500).send("Error loading page"); }
});

app.get("/notes/policy", (req, res) => {
  try { res.render("policy.ejs"); }
  catch (err) { console.error(err); res.status(500).send("Error loading page"); }
});


app.get("/notes/free-pdf",(req,res)=>{

  try { res.render("freepdf.ejs"); }
  catch (err) { console.error(err); res.status(500).send("Error loading page"); }

});

// ---------- FREE DOWNLOADS ----------
app.get("/download/free/:filename", (req, res) => {
  const filePath = path.join(__dirname, "public", "free", req.params.filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("Free file not found.");
  }

  res.download(filePath, err => {
    if (err) {
      console.error("Free file download error:", err);
      res.status(500).send("Error downloading free file.");
    }
  });
});

// ---------- PAID PDFS ----------

// Step 1: Create order
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = { amount, currency: "INR", receipt: "receipt_" + Date.now() };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).send("Error creating order");
  }
});

// Step 2: Verify payment & store purchase
// Step 2: Verify payment & store purchase with email
app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;

    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    // Verify payment signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      const files = [
        "Complete history theory one linear.pdf",
        "complete geography.pdf",
        "eco complete.pdf",
        "Environment-Ecology.pdf",
        "complete polity.pdf",
        "haryana gk.pdf",
        "Complete Hindi Grammar.pdf",
        "english-grammer.pdf",
        "Reasoning Solved Problems.pdf",
        "Mathematics Complete Solved Problems.pdf",
        "Complete Science Notes.pdf",
        "Haryana Police Notes.pdf",
        "BCM Notes.pdf",
        "Complete Computer Notes.pdf",
      ];

      // Store purchase in DB with email
      const purchase = await Purchase.create({
        email,
        payment_id: razorpay_payment_id,
        razorpay_order_id,
        files,
        amount: 29900
      });

      // Send email receipt
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });

      const downloadLinks = files.map(f => `${req.protocol}://${req.get("host")}/download/paid/${purchase._id}/${f}`);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "✅ Your Premium Notes Purchase",
        html: `<h4>Congrats! You got HSSC CET Premium Study Material</h4>
               <p>Thanks for your purchase of ₹299!</p>
               <p>Download your notes anytime:</p>
               <ul>${downloadLinks.map(l => `<li><a href="${l}">${l}</a></li>`).join("")}</ul>
               <h4>ALL THE BEST FOR YOUR EXAM!</h4>
               `
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("Email error:", err);
        else console.log("Email sent:", info.response);
      });

      res.json({ success: true, files, purchaseId: purchase._id });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }

  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).send("Internal server error");
  }
});


// Route to serve paid files securely
app.get("/download/paid/:purchaseId/:filename", async (req, res) => {
  try {
    const { purchaseId, filename } = req.params;
    const purchase = await Purchase.findById(purchaseId);

    if (!purchase || !purchase.files.includes(filename)) {
      return res.status(403).send("Unauthorized or file not found.");
    }

    // ✅ NEW: files are now in files/paid/
    const filePath = path.join(__dirname, "files", "paid", filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Paid file not found on server.");
    }

    res.download(filePath, err => {
      if (err) {
        console.error("Paid file download error:", err);
        res.status(500).send("Error downloading paid file.");
      }
    });
  } catch (err) {
    console.error("Paid download route error:", err);
    res.status(500).send("Internal server error");
  }
});



// Fetch purchases by email
app.get("/get-purchases", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email required" });

    const purchases = await Purchase.find({ email }).sort({ createdAt: -1 });
    res.json({ purchases });
  } catch (err) {
    console.error("Error fetching purchases:", err);
    res.status(500).json({ error: "Server error" });
  }
});



//check if email already exists in db
app.post("/check-purchase", async (req, res) => {
  const { email } = req.body;
  try {
    const purchase = await Purchase.findOne({ email: email });
    if (purchase) {
      res.json({ purchased: true });
    } else {
      res.json({ purchased: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});





// Handle contact form submission
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, phone, subject, message, "inquiry-type": inquiryType } = req.body;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS  // your App Password (not Gmail password)
      }
    });

    // Email content
    const mailOptions = {
      from: email,
      to: "hssccetnotes@gmail.com", // your receiving email
      subject: `📩 New Contact Form Message - ${subject || "No subject"}`,
      html: `
        <h3>You got a new inquiry</h3>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone || "N/A"}</p>
        <p><b>Inquiry Type:</b> ${inquiryType}</p>
        <p><b>Message:</b><br>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Message sent successfully!" });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ success: false, message: "Failed to send message." });
  }
});



module.exports = app;
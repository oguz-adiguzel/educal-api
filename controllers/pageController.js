const nodemailer = require("nodemailer");

exports.getIndexPage = (req, res) => {
  // console.log(req.session.userID)
  res.status(200).render("index", {
    page_name: "index",
  });
};

exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.sendEmail = async (req, res) => {
  try{

    const outputMessage = `
   <div style="width:100%; display:flex; justify-content:center; align-items:center">
    <div style="width:80%; padding: 20px 0px;">
      <h1>Mail Details </h1>
      <ul>
        <li>Name: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
      </ul>
      <h1>Message</h1>
      <p>${req.body.message}</p>
    </div>
   </div>
    `
  
    const transporter = nodemailer.createTransport({
      host: 'smtp.outlook.com',
      port: 587,
      auth: {
          user: 'ogzdgzl@hotmail.com',
          pass: process.env.GMAIL_PASSWORD
      }
  });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Smart EDU Contact Form" <ogzdgzl@hotmail.com>', // sender address
      to: "oguz_adiguzel@outlook.com", // list of receivers
      subject: "Smart EDU Contact Form New Message ✔", // Subject line
      html: outputMessage, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  
    // req.flash("success", "We Received your message succesfully");
  
    res.status(200).json({message:'Mail Gönderildi'})
  
  } catch (err) {
    //req.flash("error", `Something happened! ${err}`);
    // req.flash("error", `Something happened!`);
    console.log(err);
    res.status(400).json({message:'Hata', error:err});
  }

};
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');
const express = require("express");
const cookieParser = require("cookie-parser");
const smtpTransport = require("nodemailer-smtp-transport");
const User = require("../models/user");
const Course = require("../models/courses");
const cloudinary = require("../config/cloudinary");
const upload = require("../middleware/multer");
const fs = require("fs");
const pdfParse = require('pdf-parse');
const { translate } = require('@vitalets/google-translate-api');
const { OpenAI } = require('openai');
const { dialogflow } = require('dialogflow');
const { HttpProxyAgent } = require('http-proxy-agent');
// const dialogflowClient = new dialogflow.SessionsClient();
// const fetch = require('node-fetch');


// process key and create instance of open ai
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();

app.use(express.json());
app.use(cookieParser());
dotenv.config();
const { TOKEN_KEY, EMAIL_USERNAME, SMTP_EMAIL, SMTP_PASS, EMAIL_PASSWORD, EMAIL_HOST } = process.env;

let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    secure: false, // 465,
    port: 587,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
}))

app.post("/register", async(req, res) => {
    try {
        const {
            email,
            fullname,
            password,
        } = req.body;
        console.log(req.body);

        if (!email || !fullname || !password) {
            // return res
            //     .status(400)
            //     .json({ msg: "Please fill the form completely", status: false });
            // Create an error message 
            let errorMessage = JSON.stringify({
                "message": "Please fill the form completely.",
                "status": "error",
                "statusCode": 400,
            });

            // Sending the error message 
            return res.send(errorMessage);
        }

        const userExist = await User.findOne({ email });
        if (userExist) {
            // return res
            //     .status(400)
            //     .json({ msg: "Email already registered with us", status: false });
            // Create an error message 
            let errorMessage = JSON.stringify({
                "message": "Email already registered with us.",
                "status": "error",
                "statusCode": 409,
            });

            // Sending the error message 
            return res.send(errorMessage);
        }

        const refcode = await ref.gencode();

        const mailOptions = {
            from: EMAIL_USERNAME,
            to: email,
            subject: `Hello ${fullname}`,
            html: `<body>
            <body style="font-family: Arial, sans-serif margin: 0 padding: 0 background-color: #ffffb3">
            <table role="presentation" cellspacing="0" cellpadding="0"  width="600"
            style="margin: 0 auto background-color: #fff padding: 20px border-radius: 5px box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3)">
            <tr>
            <td>
            <h3 style="color: #0838bc font-size: 24px text-align: center margin-bottom: 10px">Welcome To Learning Assistant</h3>
            <hr style="border: 1px solid #ccc margin: 20px 0">
            <h4 style="font-size: 20px color: #333">Your Referral ID has been activated now</h4>
            <p style="font-size: 16px color: #333 margin: 20px 0">[When you refer new user dont forget to mention your Referral ID while filling 
                the registration form]
                </p>
                <p style="font-size: 16px color: #333">Here is your referral code ${refcode}</p>
                <div style="font-size: 16px color: #333 margin-top: 20px text-align: center">
                <h5 style="font-size: 18px">Best Regards,</h5>
                <h5 style="font-size: 18px">Learning Assistant Team</h5> 
                </div>
                </td>
                </tr>
                </table>
                </body>
                </body>`,
        };
        // Encrypt the password and create a salt hash 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        await transporter.sendMail(mailOptions);
        console.log("mail sent");

        const newUser = await User.create({
            password: hashedPassword,
            email,
            fullname,
            refcount: 0,
            refid: refcode,
        });
        console.log(newUser);
        // res.status(200).json({
        //     status: true,
        //     msg: "User registered successfully check mail for further instruction and unique refer code!",
        // });
        // Generating the success message 
        let successMessage = JSON.stringify({
            "message": "User registered successfully check mail for further instruction and unique refer code!",
            "status": "success",
            "statusCode": 200
        });

        // Return the success message 
        return res.send(successMessage);
    } catch (error) {
        console.error("Error registering user:", error);
        // res.status(500).json({ status: false, msg: "Internal server error" });
        // Creating the error message 
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(),
            "status": "error",
            "statusCode": 500,
        });

        // Sending back the error message 
        return res.send(errorMessage);
    }
});

app.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({
                msg: "Please fill the login details completely",
                status: false,
            });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            // Create the error message 
            let errorMessage = JSON.stringify({
                "message": "Invalid email or password",
                "status": "error",
                "statusCode": 401,
            });

            // Sending the error message 
            return res.send(errorMessage);
        }
        // Get the user password, and hash the password
        const hashedPassword = user.password;

        // checking if the password hashed value is correct 
        const isMatch = bcrypt.compareSync(password, hashedPassword);
        if (isMatch) {
            let rememberMe = true;
            const expiresIn = rememberMe ? "7d" : "2h";
            const token = jwt.sign({ id: user._id, refid: user.refid }, TOKEN_KEY, { expiresIn });
            return res
                .status(200)
                .cookie("jwt", token, {
                    httpOnly: false,
                    maxAge: expiresIn === "7d" ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
                    secure: true,
                    sameSite: "None",
                })
                .cookie("refid", user.refid, {
                    maxAge: expiresIn === "7d" ? 7 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000,
                    httpOnly: false,
                    // secure: false,
                    secure: true,
                    sameSite: "None",
                })
                .json({

                    "message": "Logged in successfully",
                    "status": "success",
                    "xAuthToken": token,
                    "statusCode": 200,
                    "refid": user.refid,
                    "username": user.fullname
                });
        } else {
            // Create the error message 
            let errorMessage = JSON.stringify({
                "message": "Invalid email or password",
                "status": "error",
                "statusCode": 401,
            });

            // Sending the error message 
            return res.send(errorMessage);
        }
    } catch (err) {
        console.log(err);
        // res.status(500).json({ msg: "Server error", status: false });
        // Creating the error message 
        let errorMessage = JSON.stringify({
            "message": err.toString().trim(),
            "status": "error",
            "statusCode": 500
        })

        // Sending back the error message 
        return res.send(errorMessage);
    }
});
app.get("/logout", async(req, res) => {
    try {
        res.clearCookie("jwt");
        res.clearCookie("refid");
        return res.status(200).json({ msg: "User Logged out and session ended" });
    } catch (ex) {
        next(ex);
    }
});
app.get("/home", auth, (req, res) => {
    res.status(200).send("User Logged in and Session is Active");
});

app.post("/upload", auth, async(req, res) => {

    upload.single("file")(req, res, function(err) {
        console.log(req.file)
        console.log("body: ", req.body)
        if (err) {
            console.log(err);
            return res.status(400).send("Error occured while uploading");
        }
        // Get the uploaded PDF file
        const pdfFile = req.file;

        // Check if a file was uploaded
        if (!pdfFile) {
            res.status(400).send({ message: 'No file uploaded' });
            return;
        }
        // start here
        // function to translate pdf content to hausa
        const agent = new HttpProxyAgent('http://103.152.112.162:80');
        async function translateText(text, targetLang) {
            try {
                const res = await translate(text, { to: targetLang });
                console.log(`Original Text: ${text}`);
                console.log(`Translated Text: ${res.text}`);
                return res.text;
            } catch (error) {
                console.error("Translation Error:", error);
            }
        }
        // function to extract pdf content
        async function readPdf(filePath) {
            try {
                const dataBuffer = fs.readFileSync(filePath);
                const data = await pdfParse(dataBuffer);
                console.log("PDF Content:\n", data.text);
                // translate pdf content to hausa
                let hausaText = await translateText(data.text, 'ha');
                const courseExisting = await Course.findOneAndUpdate({ user: req.body.refid, course: req.body.course }, { cmateria: data.text, transcontent: hausaText, uploaded: true }, { new: true });
                return res.status(200).send("Uploaded Successfully");

            } catch (error) {
                console.error("Error uploading and reading PDF:", error);
            }
        }


        //extract pdf content
        readPdf(pdfFile.path);
        //end here

    })
});

app.post("/icon", auth, async(req, res) => {
    try {
        const existing = await User.findOneAndUpdate({ refid: req.cookies.refid }, { icon: req.body.icon }, { new: true });
        return res.status(200).send("Updated Successfully");
    } catch (error) {
        return res.status(400).send("failed to update");
    }
});
// fetch user details controller
app.post("/user", auth, async(req, res) => {
    try {
        const { refid } = req.body;
        if (!refid) {
            return res.status(404).send("User Id is required");
        }
        const user = await User.findOne({ refid: refid });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).send("failed to fetch");
    }
});
// update user details controller
app.patch("/user", auth, async(req, res) => {
    try {
        const {
            refid,
            school,
            course,
            mobile,
            address
        } = req.body;
        const user = await User.findOneAndUpdate({ refid: refid }, {
            $set: {
                school,
                course,
                mobile,
                address,
            },
        }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send("User not found");
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Failed to update");
    }
});
// change user password controller
app.patch("/changeuserpassword", auth, async(req, res) => {
    try {
        const {
            refid,
            oldpass,
            newpass
        } = req.body;
        console.log(req.body)
            // if (!refid || oldpass === null || newpass === null || newpass == '') {
            //     return res.status(403).send("All fields required!");
            // }
        const salt = await bcrypt.genSalt(10);
        const hashedNPassword = bcrypt.hashSync(newpass, salt);
        const user = await User.findOneAndUpdate({ refid: refid }, {
            $set: {
                password: hashedNPassword
            },
        }, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).send("Session expired!");
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Failed to change password");
    }
});
// delete course controller
app.post("/dcourse", auth, async(req, res) => {
    try {
        const {
            refid,
            courseId
        } = req.body;
        console.log("SentD: ", req.body)
            // if (!refid || oldpass === null || newpass === null || newpass == '') {
            //     return res.status(403).send("All fields required!");
            // }
        const courseDeleted = await Course.findByIdAndDelete(courseId);
        return res.status(200).json({ msg: "Course deleted successfully!" });
    } catch (error) {
        console.error(error);
        return res.status(400).send("Failed to delete courses. Try again later.");
    }
});

// fetch course details by courseId controller
app.post("/coursedetails", auth, async(req, res) => {
    try {
        const {
            refid,
            courseId
        } = req.body;
        console.log("SentD: ", req.body)
            // if (!refid || oldpass === null || newpass === null || newpass == '') {
            //     return res.status(403).send("All fields required!");
            // }
        const courseD = await Course.findOne({ _id: courseId });
        // return res.status(200).json({courseD});
        let jsondata = JSON.stringify(courseD);

        // Sending the error message 
        return res.send(jsondata);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Failed to delete courses. Try again later.");
    }
});

// fetch course details by course name controller
app.post("/coursename", auth, async(req, res) => {
    try {
        const {
            refid,
            coursename
        } = req.body;
        console.log("SentD: ", req.body)
            // if (!refid || oldpass === null || newpass === null || newpass == '') {
            //     return res.status(403).send("All fields required!");
            // }
        const courseD = await Course.findOne({ course: coursename, user: refid });
        // return res.status(200).json({courseD});
        let jsondata = JSON.stringify(courseD);

        // Sending the error message 
        return res.send(jsondata);
    } catch (error) {
        console.error(error);
        return res.status(400).send("Failed to delete courses. Try again later.");
    }
});

app.get("/notify", auth, async(req, res) => {
    try {
        const refid = req.cookies.refid;
        const msg = await message.find({ refid });
        return res.status(200).json(msg);
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Can't find appropriate data", status: false });
    }
});

app.post("/mail", upload.single("file"), async(req, res) => {
    const { subject, type, description, email } = req.body;
    const file = req.file;
    if (!subject || !type || !description) {
        return res.status(403).json({ status: "error", message: "All fields are required!" });
    }
    let mailOptions = {
        from: SMTP_EMAIL,
        to: "cidusface@gmail.com",
        subject: subject,
        text: `Type: ${type}\nDescription: ${description}`,
        attachments: [{
            filename: file.originalname,
            path: file.path,
        }, ],
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        return res.status(200).json({
            status: "success",
            message: "Mail sent "
        });
    } catch (error) {
        console.log(error);
    }

});
app.post("/maintenance", upload.single("file"), async(req, res) => {
    const requestid = ref.gencode();
    const { serviceid, address, service, servicetype, customer, problem, timeslot, message, refid } = req.body;
    // const file = req.file;
    if (!service || !servicetype || !customer || !timeslot, !address) {
        return res.status(403).json({ status: "error", message: "All fields are required!" });
    }
    let mailOptions = {
        from: SMTP_EMAIL,
        to: "cidusface@gmail.com",
        subject: "Maintenace Request From: " + customer,
        text: `Hey,\n You have a new maintenance request to attend to.`
    };

    try {
        const newService = await services_request.create({
            address,
            requestid,
            customer,
            serviceid,
            service,
            servicetype,
            problem,
            timeslot,
            message,
            refid
        });
        console.log(newService);

        // Generating the success message 
        let successMessage = JSON.stringify({
            "message": "Ticket has been submitted!",
            "status": "success",
            "statusCode": 200
        });

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
        // Return the success message 
        return res.send(successMessage);
        // return res.status(200).json({
        //     status: "success",
        //     message: "Mail sent "
        // });
    } catch (error) {
        console.log(error);
        let errorMessage = JSON.stringify({
            "message": error.message,
            "status": "error",
            "statusCode": 501
        });
        return res.send(errorMessage);
    }

});

// add new course
app.post("/course", auth, async(req, res) => {
    try {
        const {
            refid,
            course,
        } = req.body;
        console.log(req.body);

        if (!course) {
            // return res
            //     .status(400)
            //     .json({ msg: "Please fill the form completely", status: false });
            // Create an error message 
            let errorMessage = JSON.stringify({
                "message": "Course name is required.",
                "status": "error",
                "statusCode": 400,
            });

            // Sending the error message 
            return res.send(errorMessage);
        }

        const userExist = await Course.findOne({ course });
        if (userExist) {
            // return res
            //     .status(400)
            //     .json({ msg: "Email already registered with us", status: false });
            // Create an error message 
            let errorMessage = JSON.stringify({
                "message": "Course already exist in your account. Pleasek your input and try again!",
                "status": "error",
                "statusCode": 409,
            });

            // Sending the error message 
            return res.send(errorMessage);
        }


        const newCourse = await Course.create({
            user: refid,
            course: course,
        });
        console.log(newCourse);
        // res.status(200).json({
        //     status: true,
        //     msg: "User registered successfully check mail for further instruction and unique refer code!",
        // });
        // Generating the success message 
        let successMessage = JSON.stringify({
            "message": "New course registered successful!",
            "status": "success",
            "statusCode": 200
        });

        // Return the success message 
        return res.send(successMessage);
    } catch (error) {
        console.error("Error registering course:", error);
        // res.status(500).json({ status: false, msg: "Internal server error" });
        // Creating the error message 
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(),
            "status": "error",
            "statusCode": 500,
        });

        // Sending back the error message 
        return res.send(errorMessage);
    }
});
// fetch all user courses
app.post("/courses", auth, async(req, res) => {
    try {
        const {
            refid,
        } = req.body;
        console.log(req.body);

        if (!refid) {
            // return res
            //     .status(400)
            //     .json({ msg: "Please fill the form completely", status: false });
            // Create an error message 
            let errorMessage = JSON.stringify({
                "message": "Session Expires!",
                "status": "error",
                "statusCode": 405,
            });

            // Sending the error message 
            return res.send(errorMessage);
        }

        const allcourses = await Course.find({ user: refid });
        if (allcourses) {
            // return res
            //     .status(400)
            //     .json({ msg: "Email already registered with us", status: false });
            // Create an error message 
            let jsondata = JSON.stringify(allcourses);

            // Sending the error message 
            return res.send(jsondata);
        }

        let msg = JSON.stringify({
            "message": "Not found!",
            "status": "not found",
            "statusCode": 404
        });

        // Return the success message 
        return res.send(msg);
    } catch (error) {
        console.error("Error registering course:", error);
        // res.status(500).json({ status: false, msg: "Internal server error" });
        // Creating the error message 
        let errorMessage = JSON.stringify({
            "message": error.toString().trim(),
            "status": "error",
            "statusCode": 500,
        });

        // Sending back the error message 
        return res.send(errorMessage);
    }
});

// controller to summarize course note
app.post("/summarize", auth, async(req, res) => {
    const { token, courseNote } = req.body;
    console.log(courseNote)
        //define function to summarize text using openai
    async function summarizeText1(text) {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [{ role: "system", content: "Summarize the following text." }, { role: "user", content: text }],
                temperature: 0.7,
                max_tokens: 100,
            });

            console.log("Summary:", response.choices[0].message.content);
        } catch (error) {
            console.error("Error summarizing text:", error);
        }
    }
    // Summarize course note
    // summarizeText1("Artificial Intelligence (AI) is a field of computer science that aims to create systems capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding.");

    // using hf api
    async function summarizeText2(text) {
        const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
            method: "POST",
            headers: { Authorization: "Bearer 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", "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: text }),
        });

        const data = await response.json();
        console.log("Summary:", data);
    }

    // Summarize course note
    summarizeText2(courseNote);


})

//chat box
// app.post('/answer', (req, res) => {
//   const sessionId = req.body.sessionId;
//   const query = req.body.query;

//   const sessionPath = dialogflowClient.sessionPath('your-project-id', sessionId);

//   const request = {
//     session: sessionPath,
//     queryInput: {
//       text: {
//         text: query,
//         languageCode: 'en-US',
//       },
//     },
//   };

//   dialogflowClient.detectIntent(request)
//     .then((response) => {
//       const intent = response.queryResult.intent;
//       const answer = response.queryResult.fulfillmentText;

//       res.json({ answer });
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     });
// });


module.exports = app;
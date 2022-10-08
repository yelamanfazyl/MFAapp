require('dotenv').config();
const express = require('express');
const session = require('express-session')
const cors = require('cors');
// const isAuth = require('./middleware/isAuth.js');
const unauthorizedHandler = require('./middleware/unauthorizedHandler.js');
const authController = require('./controllers/auth.js');
const userController = require('./controllers/user.js');
const welcomeHandler = require('./middleware/welcomeHandler.js');
const errorHandler = require('./middleware/errorHandler.js');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, toUserDTO } = require('./model/user.js');
// const { compareFaces } = require('./utils.js');

const controller = express.Router();

const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '50mb', extended: true}));

app.set("view engine", "ejs");

var corsOptions = {
    origin: function (origin, callback) {
        callback(null, true);
    },
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'device-remember-token',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept'
    ]
};

app.use(morgan('tiny'));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))
const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
        next();
    }
    else {
        res.redirect('/login');
    }
};

// app.use('/api', isAuth);
// app.use(unauthorizedHandler);
// app.use('/auth', authController);
// app.use('/api/user', userController);
// app.use(welcomeHandler);
// app.use(errorHandler);

// app.post("/register", register);
app.get('/', (req, res) => res.send("AAAA"));
app.get('/asd', (req, res) => res.send("BBBB"));
app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, phone, password, faceID } =
            req.body;

        if (!(firstname && lastname && email && phone && password && faceID)) {
            // console.log('all input', req.body);
            return res.status(400).json({ message: 'All input is required' });
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res
                .status(409)
                .json({ message: 'User Already Exist. Please Login' });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstname,
            lastname,
            email,
            phone,
            password: encryptedPassword,
            faceID
        });

        const token = jwt.sign(
            { id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: 5 * 60 * 60
            }
        );

        const userWithToken = await User.findByIdAndUpdate(
            user._id,
            { token },
            { new: true }
        );

        // console.log('userWithToken', userWithToken);

        res.status(201).json(toUserDTO(userWithToken));
    } catch (err) {
        res.status(400).json(err);
    }
});

var compareRes = 0;
const compareFaces = async (source, target) => {
    const AWS = require('aws-sdk')
    const config = new AWS.Config({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    })

    const client = new AWS.Rekognition();

    target = target.substr(22);
    source = source.substr(22);

    const source_buffer = Buffer.from(source, 'base64');
    const target_buffer = Buffer.from(target, 'base64');
    
    const params = {
        SourceImage: {
            Bytes: source_buffer
        },
        TargetImage: {
            Bytes: target_buffer
        },
        SimilarityThreshold: 0
      }
    client.compareFaces(params, function(err, response) {
        if (err) {
        console.log(err, err.stack); // an error occurred
        } else {
        response.FaceMatches.forEach(data => {
            let position   = data.Face.BoundingBox
            let similarity = data.Similarity
            console.log(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
            compareRes = similarity;
            return similarity;
        }) // for response.faceDetails
        } // if
    });
}

app.post('/login', async (req, res) => {
    try {
        const { email, password, faceID } = req.body;

        if (!(email && password && faceID)) {
            res.status(400).json({ message: 'All input is required' });
        }

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            
            // let compareRes = await compareFaces(user.faceID, faceID);
            await compareFaces(user.faceID, faceID);
            
            const token = jwt.sign(
                { id: user._id, email, role: user.role },
                process.env.TOKEN_KEY,
                {
                    expiresIn: 5 * 60 * 60
                }
            );

            const updated = await User.findByIdAndUpdate(
                user._id,
                { token },
                { new: true }
            );
                
            setTimeout(() => {
                console.log(compareRes);
                if(compareRes < 93)
                    return res.status(400).json({ message: 'We didn\'t recognize you. Try again' });

                req.session.isAuth = true;

                return res.status(201).json(toUserDTO(updated));
            }
            , 15000);
        } else {
            return res.status(400).json({ message: 'Invalid Credentials!' });
        }
    } catch (err) {
        console.log(err);
    }
});

app.get('/ame', (req, res) => {
    if (req.session.isAuth) {
        return res.status(200).json({ message: "HAROSH"});
    }
    return res.status(400).json({ message: "PLOH"});
});

module.exports = app;



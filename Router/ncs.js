const express = require('express');
const router = express.Router();
const multer = require('multer');

const ncsModel = require('../model/ncs');

// upload files
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + file.originalname);
    }
});

const imageFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: imageFilter
});

// create 
// @route POST /lecture/ncs
// @desc Create ncs
// @access public(최종 private: admin)

router.post('/', upload.single('thumbnail'), (req, res) => {
    const ncsFields = {};

    if(req.body.title) ncsFields.title = req.body.title;
    if(req.body.desc) ncsFields.desc = req.body.desc;
    if(req.body.url) ncsFields.url = req.body.url;
    if(req.file.path) ncsFields.thumbnail = req.file.path;
    if(req.body.attached) ncsFields.attached = req.body.attached;
    if(typeof req.body.tag !== 'undefined'){
        ncsFields.tag = req.body.tag.split(',')
    }

    const newNcs = new ncsModel(ncsFields);
    newNcs
        .save()
        .then(item => {
            res.status(200).json({
                message: 'Successful NCS',
                ncsInfo: item
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
});


//get
router.get('/', (req, res) => {
    ncsModel
        .find()
        .then(items => {
            res.status(200).json({
                message: 'Successful Get NCS',
                count: items.length,
                ncsInfo: items
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err.message
            });
        });
    
});

module.exports = router;


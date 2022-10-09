const express = require('express');
const router = express.Router();
const Cars = require('../models/cars');
const multer = require('multer');
const fs = require('fs');

// images upload
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});

let upload = multer({
    storage: storage,
}).single("image");

// insert cars to Database route
router.post('/cars/add', upload, (req, res) => {
    const car = new Cars({
        name: req.body.name,
        size: req.body.size,
        price: req.body.price,
        image: req.file.filename,
    });
    car.save((err) => {
        if(err) {
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Data Berhasil Disimpan'
            };
            res.redirect('/cars');
        }
    })
});

router.get('/', (req, res) => {
    res.render('dashboard', { title: "Dashboard" });
});

// GET All Cars route
router.get('/cars', (req, res) => {
    Cars.find().exec((err, cars) => {
        if (err) {
            res.json({ message: err.message });
        } else {
            res.render('index', {
                title: "List Cars",
                cars: cars
            });
        }
    });
});

router.get('/cars/add', (req, res) => {
    res.render('add-car', { title: "add New Car" });
});

// Edit an Cars route 
router.get('/cars/edit/:id', (req, res) => {
    let id = req.params.id;
    Cars.findById(id, (err, car) => {
        if(err) {
            res.redirect('/cars');
        } else {
            if(car == null) {
                res.redirect('/cars');
            } else {
                res.render('edit-car', {
                    title: "Edt Car",
                    car: car,
                });
            }
        }
    });
});

// Update car route
router.post('/cars/update/:id', upload, (req, res) => {
    let id = req.params.id;
    let newImage = '';

    if(req.file) {
        newImage = req.file.filename;
        try {
            fs.unlinkSync('./uploads/' + req.body.old_image);
        } catch (error) {
            console.log(error);
        }
    } else {
        newImage = req.body.old_image;
    }

    Cars.findByIdAndUpdate(id, {
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        image: newImage,
    }, (err, result) => {
        if(err) {
            res.json({message: err.message, type: 'danger'});
        } else {
            req.session.message = {
                type: 'success',
                message: 'Data Berhasil Diperbaharui',
            };
            res.redirect('/cars');
        }
    })
});

//Delete car route
router.get('/cars/delete/:id', async(req, res) => {
    let id = req.params.id;
    Cars.findByIdAndRemove(id, (err, result) => {
        if(result.image != '') {
            try {
                fs.unlinkSync('./uploads/' + result.image);
            } catch (error) {
                console.log(error);
            }
        }

        if(err) {
            res.json({message: err.message});
        } else {
            req.session.message = {
                type: 'dark',
                message: 'Data Berhasil Dihapus'
            };
            res.redirect('/cars');
        }
    });
});

module.exports = router;
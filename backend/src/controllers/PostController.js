const Post = require('../models/Post');
const sharp = require('sharp'); 
const path = require('path');
const fs = require('fs');

module.exports = {
    async index(req, res) {
        const post = await Post.find().sort('-createdAt');

        return res.json(post);
    },

    async store(req, res) {
        const { author, place, description, hashtages } = req.body;
        const { filename: image } = req.file;

        const [name] = image.split('.');
        const fileName = `${name}.jpg`;
        
        //Redimencionar o tamanho da imagens
        await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile(
                path.resolve(req.file.destination, 'resized', fileName)
            )
        //Apagar a imagen na pasata upload
        fs.unlinkSync(req.file.path);
        
        const post = await Post.create({
            author,
            place,
            description,
            hashtages,
            image: fileName,
        });

        req.io.emit('post', post);

        return res.json(post);
    }
};
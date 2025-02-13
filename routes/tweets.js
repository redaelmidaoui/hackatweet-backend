var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');
const User = require('../models/users');

router.post('/:userId', (req, res) => {
 
    const userId = req.params.userId;
  
    // Vérifier si l'utilisateur existe dans la base de données
    User.findById(userId)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
  
        const newTweet = new Tweet({
          content: req.body.content,
          author: userId,  // L'ID de l'utilisateur passé dans l'URL
          createdAt: new Date(),
          nbLikes : req.body.nbLikes
        });
  
       
        return newTweet.save();
      })
      .then(data => {
        return Tweet.findById(data._id).populate('author');
      })
      .then(data => {
        res.json({ data });
      })
  });

router.get('/', (req,res) => {
    Tweet.find().then(data => {
        //Je créer un nouveau tableau de tweets qui contiendra le contenu de chaque tweet
        res.json({ tweets: data.map(tweet => tweet.content) })
    })
})

router.get('/:userId', (req,res) => {
    const userId = req.params.userId;

    Tweet.find({ author: userId }).then(data => {
        //Je créer un nouveau tableau de tweets qui contiendra le contenu de chaque tweet
        res.json({ tweets: data.map(tweet => tweet.content) })
    })
})

module.exports = router;

/*
router.get('/', function(req, res) {
    res.send('respond with a resource');
  });*/
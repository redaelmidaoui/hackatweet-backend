var express = require('express');
var router = express.Router();
const Tweet = require('../models/tweets');
const User = require('../models/users');
const Trend = require('../models/trends');

router.post('/', (req, res) => {
    // Vérifier si l'utilisateur existe dans la base de données
    User.findOne({token: req.body.token})
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const userId = user._id;
  
        const newTweet = new Tweet({
          content: req.body.content,
          author: userId,  // L'ID de l'utilisateur passé dans l'URL
          createdAt: new Date(),
          nbLikes : []
        });
        const hashtags = []; 
        const hashtagRegex = /#\w+/g; //On crée une regex pour trouver les hashtags
        const matches = req.body.content.match(hashtagRegex); //On cherche les hashtags dans le contenu du tweet
        if (matches) {
            hashtags.push(...matches); //On ajoute les hashtags trouvés dans le tableau hashtags
          }
        
        for (let i = 0; i < hashtags.length; i++) {
            const newTrend = new Trend({ 
                hashtag: hashtags[i],
                tweets: [newTweet._id] // On ajoute l'ID du tweet dans le tableau de tweets
            })
            Trend.findOne({ hashtag: hashtags[i] }).then(data => { 
                 //On vérifie si le hashtag existe déjà dans la base de données
                if (data) {
                    data.tweets.push(newTweet._id) //Si oui, on ajoute l'ID du tweet dans le tableau de tweets
                    return data.save();
                }
                return newTrend.save(); //Si non, on crée un nouveau hashtag
            }
        )}
        return newTweet.save(); //On sauvegarde le tweet
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
        res.json(data)
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
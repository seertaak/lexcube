/*
 * GET home page.
 */

var natural = require('natural');
var wordnet = new natural.WordNet('wordnet');
var db = require('../lib/db.js');

exports.index = function(req, res){
  res.render('index', { title: 'wordcube', user: req.user });
};

exports.login = require('./login');

exports.user = function(req, res) {
  db.User.findOne({username: req.user.username}, function(err, user) {
    console.log('MPD: /user: ' + doc);
    res.render('user', { 
      title: 'wordcube', 
      user: req.user, 
      pastSearches: user.pastSearches 
    });
  });
};

exports.lookup = function(req, res){
  var terms = {};
  terms[req.query.term ] = [].slice();
  terms[natural.LancasterStemmer.stem(req.query.term)] = [].slice();
  terms[natural.PorterStemmer.stem(req.query.term)] = [].slice();

  console.log("MPD: Searching for: " + JSON.stringify(terms));
  console.log("MPD: User: " + JSON.stringify(req.body.user));

  var count = Object.keys(terms).length;
  console.log("number of terms: " + count);

  for (var term in terms) {
    var data = [].slice();
    console.log("searching for term: " + term);
    terms[term] = [].slice();
    wordnet.lookup(term, function(t) {
      return function(results) {
        console.log("term: " + t);
        results.forEach(function(r) {
          //console.log(r);
          var defns = [].slice();
          var fields = r.gloss.split(";");
          for (i = 0; i < fields.length; i++) {
            var defn = fields[i].trim();
            defns.push(defn);
          }
          r.defn = defns[0];
          r.defns = defns.slice(1);
          r.lemma = r.lemma.replace("_", " ");
        });
        //console.log("results: " + JSON.stringify(results));
        //data.push(results);
        terms[t] = results;
        count = count - 1;
        if (count === 0) {
          for (var x in terms) {
            if (terms[x].length === 0) {
              delete terms[x];
            }
          }
          console.log("final terms: " + JSON.stringify(terms));

          if ('user' in req && req.user) {
            db.User.findOne({username: req.user.username}, function(err, u) {
              for (var x in terms) {
                u.pastSearches.push({ word: x });
              }
              u.save(function (err) {
                if (err)
                  console.log('MPD: User.update: ERROR: ' + err);
              });
            });
          }
          res.render('lookup', { title: 'wordcube', user: req.user,
            terms: terms});
        }
        //console.log("data: " + data);
      } 
    } (term));
    //terms[term] = data;
    //console.log(terms);
  }
};

/*
 * GET home page.
 */

var natural = require('natural');
var wordnet = new natural.WordNet('wordnet');

exports.index = function(req, res){
  res.render('index', { title: 'wordcube' });
};

exports.login = function(req, res) {
  res.render('login', { title: 'wordcube' });
};

exports.lookup = function(req, res){
  var terms = {};
  terms[req.query.term ] = [].slice();
  terms[natural.LancasterStemmer.stem(req.query.term)] = [].slice();
  terms[natural.PorterStemmer.stem(req.query.term)] = [].slice();

  console.log("Searching for: " + JSON.stringify(terms));

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
          res.render('lookup', { title: 'wordcube', 
            terms: terms});
        }
        //console.log("data: " + data);
      } 
    } (term));
    //terms[term] = data;
    //console.log(terms);
  }
};

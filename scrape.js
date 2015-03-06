var request = require('request')
var cheerio = require('cheerio')

var urlSpeakers = 'http://devnexus.com/s/speakers'
var urlSessions = 'http://devnexus.com/s/presentations'

request(urlSessions, function(err, resp, body) {
  var $ = cheerio.load(body),
      $body = $('body'),
      $sessions = $body.find('.masonryitem')

  $sessions.each(function(i, item) {
    var title = $(item).find('.presentation-title').text()
    console.log(title)
  })
})

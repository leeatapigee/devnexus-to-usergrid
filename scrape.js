var request = require('request')
var cheerio = require('cheerio')

var urlSpeakers = 'http://devnexus.com/s/speakers'
var urlSessions = 'http://devnexus.com/s/presentations'

request(urlSessions, function(err, resp, body) {
  var $ = cheerio.load(body),
      $body = $('body'),
      $sessions = $body.find('.masonryitem')
  var slotSeparators = [',', '\\|'];

  $sessions.each(function(i, item) {
    var picture = $(item).find('.img-circle').attr('src')
    var speaker = $(item).find('.img-circle').attr('alt')
    var title = $(item).find('.presentation-title').text().trim()
    var desc = $(item).find('.col-xs-12 p').text().trim()
    // for the session attributes, get the collection of rows
    var rows = $(item).find('.row .col-xs-9')
    var track = $(rows[0]).text().trim()
    var skill = $(rows[1]).text().trim()
    var slotText = $(rows[2]).text().trim()

    // parse into date, time, room
    var slotTokens = slotText.split(new RegExp(slotSeparators.join('|'), 'g'))
    var date = slotTokens[0].trim()
    var time = slotTokens[1].trim()
    var room = slotTokens[2].trim()

    // split by commas
    var tagsTokens = $(rows[3]).text().trim().split(',')
    var tags = '|'
    tagsTokens.forEach(function(elem, i, arr){
      tags += elem.trim() + '|'
    })

    console.log(title+' '+picture+' '+speaker+' '+'--desc--'+' '+track+' '+skill+' '+date+' '+time+' '+room+' '+' '+tags)
  })
})

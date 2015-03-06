var request = require('request')
var cheerio = require('cheerio')

var urlSpeakers = 'http://devnexus.com/s/speakers'

request(urlSpeakers, function(err, resp, body) {
  var $ = cheerio.load(body),
      $body = $('body'),
      $speakers = $body.find('.speaker-member')

  $speakers.each(function(i, item) {
    var speaker = $(item).find('h4').text().trim()
    var picture = $(item).find('img').attr('src')
    var social = []

    $(item).find('p.text-center a').each(function(i, elem) {
      social.push($(elem).attr('href'))
    })

    var bio = ''
    var paragraph = $(item).find('p:empty').next()
    while( !$(paragraph).is(':empty') ) {
      bio += $(paragraph).text().trim() + '\n'
      paragraph = $(paragraph).next()
    }

    console.log(speaker+' '+picture+' '+bio+' '+social.join(' + ')+'\n')
  })
})

var request = require('request')
var cheerio = require('cheerio')
var usergrid = require('usergrid')

var client = new usergrid.client({
  orgName: 'devnexus',
  appName: '2015',
  authType: usergrid.AUTH_CLIENT_ID,
  clientId: 'b3U6apHSesK4EeS83ifhCLdAvA',
  clientSecret: 'b3U632uksMm62PSaNgrbpUkj3kGWxp0',
  logging: true,
  buildCurl: true
})

var urlSpeakers = 'http://devnexus.com/s/speakers'

request(urlSpeakers, function(err, resp, body) {
  var $ = cheerio.load(body),
      $body = $('body'),
      $speakers = $body.find('.speaker-member')
  var speakerCount = 0

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
    ++speakerCount

    // use the usergrid npm module to create the speakers entities
    var options = {
      type: 'speakers',
      name: speaker,
      speaker: speaker,
      picture: picture,
      social: social,
      bio: bio
    }

    // TODO the inserts work, but there are async issues with the console output
    client.createEntity(options, function(err, speakerEntity) {
      if( err ) {
        console.log(speakerCount+'  error: '+err)
      } else {
        console.log(speakerCount+'  '+speakerEntity.uuid+'='+speakerEntity.name)
      }
    })
  })

  console.log(speakerCount+' speakers')
})

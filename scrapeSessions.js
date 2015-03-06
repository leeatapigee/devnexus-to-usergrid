var request = require('request')
var cheerio = require('cheerio')

var token = 'YWMtu94ZysPDEeSdcoVXW_JxVwAAAUwRqMmNhwTJ3YnE3lLcfP2oPw3szcPli8g'
var urlSessions = 'http://devnexus.com/s/presentations'

request(urlSessions, function(err, resp, body) {
  var $ = cheerio.load(body),
      $body = $('body'),
      $sessions = $body.find('.masonryitem')
  var slotSeparators = [',', '\\|'];
  var sessionCount = 0

  var rooms = []
  var timeslots = []


  $sessions.each(function(i, item) {
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

    // rely on the unique name property to prevent duplicate rooms and timeslots
    var timeslot = {name: date+' '+time, date: date, time: time}
    timeslots.push(timeslot)
    var room = {name: room, room: room}
    rooms.push(room)

    // split by commas
    var tagsTokens = $(rows[3]).text().trim().split(',')
    var tags = '|'
    tagsTokens.forEach(function(elem, i){
      tags += elem.trim() + '|'
    })

    // use the API to create each session entity
    var options = {
      uri: 'https://api.usergrid.com/devnexus/2015/sessions',
      method: 'POST',
      auth: {
        bearer: token
      },
      json: {
        name: title,
        title: title,
        speaker: speaker,
        description: desc,
        track: track,
        skill: skill,
        date: date,
        time: time,
        room: room,
        tags: tags
      }
    }

    request(options, function(err, resp, body) {
      if( err || resp.statusCode !== 200 ) {
        console.log(resp.statusCode+': '+err+'\n'+JSON.stringify(body))
      }
    })

    ++sessionCount
  })

  console.log(sessionCount+' sessions')

  //////////////////////////////////////////////////////////////////////////////
  // POST timeslots and rooms
  console.log(timeslots.length+' timeslots, '+rooms.length+' rooms')

  // create all timeslots with a single POST
  var options = {
    uri: 'https://api.usergrid.com/devnexus/2015/timeslots',
    method: 'POST',
    auth: {
      bearer: token
    },
    json: timeslots
  }

  request(options, function(err, resp, body) {
    if( err || resp.statusCode !== 200 ) {
      console.log(resp.statusCode+': '+err+'\n'+JSON.stringify(body))
    }
  })

  //////////////////////////////////////////////////////////////////////////////
  // create all rooms with a single POST
  var options = {
    uri: 'https://api.usergrid.com/devnexus/2015/rooms',
    method: 'POST',
    auth: {
      bearer: token
    },
    json: rooms
  }

  request(options, function(err, resp, body) {
    if( err || resp.statusCode !== 200 ) {
      console.log(resp.statusCode+': '+err+'\n'+JSON.stringify(body))
    }
  })
})

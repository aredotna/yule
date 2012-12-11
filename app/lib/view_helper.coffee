# Put your handlebars.js helpers here.

Handlebars.registerHelper 'if_equals', (thing, other_thing, options) ->
  if thing is other_thing
    options.fn this
  else
    options.inverse this

Handlebars.registerHelper 'twitter_handle_link', ()->
  url = @source.url.split('/')
  return "<a href='#{@source.url}'>@#{url[3]}</a>"

Handlebars.registerHelper "debug", (optionalValue) -> 
  console.log("Current Context")
  console.log("====================")
  console.log(this)

  if optionalValue
    console.log("Value")
    console.log("====================")
    console.log(optionalValue)

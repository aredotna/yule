Model = require 'models/model'
Blocks = require 'collections/blocks'

module.exports = class Channel extends Model

  url: -> "http://api.are.na/v2/channels/#{@get('id')}"

  maybeLoad: (colID) ->
    if colID is @get('id') # if passed slug matches 'slug' attribute of collection
      return true
    else
      @clear()
      app.loading().start()
      @set 'id', colID
      @fetch
        success: =>
          console.log "#{@get('slug')}'s blocks fetched"
          @setupBlocks()
          app.loading().stop()
          return true
        error: (error) =>
          console.log "Error: #{error}"

  setupBlocks: ->
    @contents = new Blocks()
    @contents.channel = this
    @contents.add @get('contents') # Add 'contents' to model.contents
    console.log "#{@get('slug')}'s blocks added to collection"
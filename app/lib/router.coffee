application = require 'application'
Channel = require 'models/channel'
CollectionView = require 'views/collection_view'

module.exports = class Router extends Backbone.Router
  routes:
    '' : 'home'
    ':slug': 'channel'

  home: -> @channel 'nada-miami'
  
  channel: (slug) ->
    @base_channel = new Channel id: slug
    
    $.when(@base_channel.fetch()).then =>
      @base_channel.setupBlocks()

      @collectionView = new CollectionView
        model       : @base_channel
        collection  : @base_channel.contents
        
      $('#content').html @collectionView.render().el # render collectionView into #content

      soundManager.setup
        url: './swf/'
        flashVersion: 9
        onready: -> 
          inlinePlayer = new InlinePlayer()
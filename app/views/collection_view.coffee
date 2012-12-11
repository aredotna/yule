module.exports = class CollectionView extends Backbone.View
  id: 'collection'

  initialize: ->
    document.title =  "#{@model.get 'title'} - Friends x Family"
    @template = require "./templates/collection"
  
  render: ->
    @$el.append @template
      channel : @model.toJSON()
      blocks  : @collection.toJSON()

    @replacePossibleChannels()

    return this

  replacePossibleChannels: ->
    channels = _.filter @collection.models, (model) -> model.get('class') is "Channel"

    $('.possible-channel').each (i)->
      title = $(@).text()
      match = _.find channels, (c)-> c.get('title') is title

      if match
        a = $('<a/>').attr 'href', "#/#{match.get('slug')}"
        $(@).wrap(a)
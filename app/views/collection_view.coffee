module.exports = class CollectionView extends Backbone.View
  id: 'collection'

  initialize: ->
    @template = require "./templates/collection"
  
  render: =>
    console.log 'rendering'
    @$el.html @template
      channel : @model.toJSON()
      blocks  : @collection.toJSON()

    $('#content').html @el

    return this
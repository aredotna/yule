module.exports = class CollectionView extends Backbone.View
  id: 'collection'



  initialize: ->
    @template = require "./templates/collection"

    @collection.on 'add', @render
  
  render: ->
    @$el.append @template
      channel : @model.toJSON()
      blocks  : @collection.toJSON()


    setTimeout 

    return this
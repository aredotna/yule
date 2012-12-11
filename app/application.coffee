# The application bootstrapper.

App =
  title: 'Arena Holidays / 2012'

  initialize: ->
    Router = require 'lib/router'
    HomeView = require 'views/home_view'

    @homeView = new HomeView()
    $('body').html @homeView.render().el

    # Instantiate the router
    @router = new Router()

    # Freeze the object
    Object.freeze? this

  loading: ->
    start: ->
      console.log 'LOADING!!!!'
      $('#content').html('')
      $('#scrim').addClass('loading')
    stop: ->
      console.log 'DONE LOADING!!!!'
      $('#scrim').removeClass('loading')

module.exports = App

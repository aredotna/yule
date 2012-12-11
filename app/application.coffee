# The application bootstrapper.

App =
  title: 'NADA Pool Party'

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

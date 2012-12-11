(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"application": function(exports, require, module) {
  var App;

  App = {
    title: 'Arena Holidays / 2012',
    initialize: function() {
      var HomeView, Router;
      Router = require('lib/router');
      HomeView = require('views/home_view');
      this.homeView = new HomeView();
      $('body').html(this.homeView.render().el);
      this.router = new Router();
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    },
    loading: function() {
      return {
        start: function() {
          console.log('LOADING!!!!');
          $('#content').html('');
          return $('#scrim').addClass('loading');
        },
        stop: function() {
          console.log('DONE LOADING!!!!');
          return $('#scrim').removeClass('loading');
        }
      };
    }
  };

  module.exports = App;
  
}});

window.require.define({"collections/blocks": function(exports, require, module) {
  var Block, Blocks,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Block = require("models/block");

  module.exports = Blocks = (function(_super) {

    __extends(Blocks, _super);

    function Blocks() {
      this.update = __bind(this.update, this);
      return Blocks.__super__.constructor.apply(this, arguments);
    }

    Blocks.prototype.model = Block;

    Blocks.prototype.url = 'http://api.are.na/v2/channels/arena-holiday-party-2012';

    Blocks.prototype.parse = function(data) {
      return data.contents;
    };

    Blocks.prototype.comparator = function(block) {
      return -block.get('position');
    };

    Blocks.prototype.update = function() {
      return this.fetch({
        add: true
      });
    };

    Blocks.prototype._filtered = function(criteria) {
      return new Blocks(this.filter(criteria));
    };

    Blocks.prototype.bySelection = function(selection) {
      return this._filtered(function(block) {
        return block.get('selected') === true;
      });
    };

    Blocks.prototype.pluckImages = function() {
      return _.map(this.where({
        "class": "Image"
      }), function(model) {
        return model.get('image').original.url;
      });
    };

    Blocks.prototype.cleanConnections = function() {
      var menu_channels;
      menu_channels = app.menu.contents.where({
        type: 'Channel'
      }).map(function(model) {
        return model.id;
      });
      return this.each(function(model) {
        var connections;
        connections = _.filter(model.get('connections'), function(connection) {
          var included, published;
          included = _.include(menu_channels, connection.channel.id);
          published = connection.channel.published;
          return included && published;
        });
        return model.set('connections', connections);
      });
    };

    return Blocks;

  })(Backbone.Collection);
  
}});

window.require.define({"collections/collection": function(exports, require, module) {
  var Collection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Collection = (function(_super) {

    __extends(Collection, _super);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    return Collection;

  })(Backbone.Collection);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var app;

  app = require('application');

  $(function() {
    app.initialize();
    return Backbone.history.start();
  });
  
}});

window.require.define({"lib/router": function(exports, require, module) {
  var Channel, CollectionView, Router, application,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  application = require('application');

  Channel = require('models/channel');

  CollectionView = require('views/collection_view');

  module.exports = Router = (function(_super) {

    __extends(Router, _super);

    function Router() {
      return Router.__super__.constructor.apply(this, arguments);
    }

    Router.prototype.routes = {
      '': 'home',
      ':slug': 'channel'
    };

    Router.prototype.home = function() {
      return this.channel('arena-holiday-party-2012');
    };

    Router.prototype.channel = function(slug) {
      var _this = this;
      this.base_channel = new Channel({
        id: slug
      });
      return $.when(this.base_channel.fetch()).then(function() {
        _this.base_channel.setupBlocks();
        _this.collectionView = new CollectionView({
          model: _this.base_channel,
          collection: _this.base_channel.contents
        });
        return _this.collectionView.render();
      });
    };

    return Router;

  })(Backbone.Router);
  
}});

window.require.define({"lib/view_helper": function(exports, require, module) {
  
  Handlebars.registerHelper('if_equals', function(thing, other_thing, options) {
    if (thing === other_thing) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('twitter_handle_link', function() {
    var url;
    url = this.source.url.split('/');
    return "<a href='" + this.source.url + "'>@" + url[3] + "</a>";
  });

  Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
      console.log("Value");
      console.log("====================");
      return console.log(optionalValue);
    }
  });
  
}});

window.require.define({"models/block": function(exports, require, module) {
  var Block,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Block = (function(_super) {

    __extends(Block, _super);

    function Block() {
      return Block.__super__.constructor.apply(this, arguments);
    }

    return Block;

  })(Backbone.Model);
  
}});

window.require.define({"models/channel": function(exports, require, module) {
  var Blocks, Channel, Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('models/model');

  Blocks = require('collections/blocks');

  module.exports = Channel = (function(_super) {

    __extends(Channel, _super);

    function Channel() {
      return Channel.__super__.constructor.apply(this, arguments);
    }

    Channel.prototype.url = function() {
      return "http://api.are.na/v2/channels/" + (this.get('id'));
    };

    Channel.prototype.maybeLoad = function(colID) {
      var _this = this;
      if (colID === this.get('id')) {
        return true;
      } else {
        this.clear();
        app.loading().start();
        this.set('id', colID);
        return this.fetch({
          success: function() {
            console.log("" + (_this.get('slug')) + "'s blocks fetched");
            _this.setupBlocks();
            app.loading().stop();
            return true;
          },
          error: function(error) {
            return console.log("Error: " + error);
          }
        });
      }
    };

    Channel.prototype.setupBlocks = function() {
      this.contents = new Blocks();
      this.contents.channel = this;
      this.contents.add(this.get('contents'));
      return console.log("" + (this.get('slug')) + "'s blocks added to collection");
    };

    return Channel;

  })(Model);
  
}});

window.require.define({"models/model": function(exports, require, module) {
  var Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Model = (function(_super) {

    __extends(Model, _super);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    return Model;

  })(Backbone.Model);
  
}});

window.require.define({"views/collection_view": function(exports, require, module) {
  var CollectionView,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = CollectionView = (function(_super) {

    __extends(CollectionView, _super);

    function CollectionView() {
      this.render = __bind(this.render, this);
      return CollectionView.__super__.constructor.apply(this, arguments);
    }

    CollectionView.prototype.id = 'collection';

    CollectionView.prototype.initialize = function() {
      return this.template = require("./templates/collection");
    };

    CollectionView.prototype.render = function() {
      console.log('rendering');
      this.$el.html(this.template({
        channel: this.model.toJSON(),
        blocks: this.collection.toJSON()
      }));
      $('#content').html(this.el);
      return this;
    };

    return CollectionView;

  })(Backbone.View);
  
}});

window.require.define({"views/home_view": function(exports, require, module) {
  var HomeView, View, template,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  template = require('./templates/home');

  module.exports = HomeView = (function(_super) {

    __extends(HomeView, _super);

    function HomeView() {
      return HomeView.__super__.constructor.apply(this, arguments);
    }

    HomeView.prototype.id = 'home-view';

    HomeView.prototype.template = template;

    return HomeView;

  })(View);
  
}});

window.require.define({"views/templates/collection": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, foundHelper, tmp1, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n\n  <div class=\"block\">\n\n  ";
    stack1 = "Image";
    foundHelper = helpers['class'];
    stack2 = foundHelper || depth0['class'];
    foundHelper = helpers.if_equals;
    stack3 = foundHelper || depth0.if_equals;
    tmp1 = self.program(2, program2, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n  ";
    stack1 = "Link";
    foundHelper = helpers['class'];
    stack2 = foundHelper || depth0['class'];
    foundHelper = helpers.if_equals;
    stack3 = foundHelper || depth0.if_equals;
    tmp1 = self.program(4, program4, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n  ";
    stack1 = "Attachment";
    foundHelper = helpers['class'];
    stack2 = foundHelper || depth0['class'];
    foundHelper = helpers.if_equals;
    stack3 = foundHelper || depth0.if_equals;
    tmp1 = self.program(9, program9, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n\n  ";
    stack1 = "Media";
    foundHelper = helpers['class'];
    stack2 = foundHelper || depth0['class'];
    foundHelper = helpers.if_equals;
    stack3 = foundHelper || depth0.if_equals;
    tmp1 = self.program(12, program12, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  \n  </div>\n\n";
    return buffer;}
  function program2(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n    <!-- IMAGE -->\n    <div class=\"info\" href=\"";
    foundHelper = helpers.image;
    stack1 = foundHelper || depth0.image;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.original);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "image.original.url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">\n      <p>";
    foundHelper = helpers.connected_at;
    stack1 = foundHelper || depth0.connected_at;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "connected_at", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</p>\n      ";
    foundHelper = helpers.description_html;
    stack1 = foundHelper || depth0.description_html;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description_html", { hash: {} }); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n    </div>\n    <img src=\"";
    foundHelper = helpers.image;
    stack1 = foundHelper || depth0.image;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.display);
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "image.display.url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" />\n  ";
    return buffer;}

  function program4(depth0,data) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n    ";
    foundHelper = helpers.debug;
    stack1 = foundHelper || depth0.debug;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "debug", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n\n    ";
    stack1 = "Twitter";
    foundHelper = helpers.source;
    stack2 = foundHelper || depth0.source;
    stack2 = (stack2 === null || stack2 === undefined || stack2 === false ? stack2 : stack2.provider);
    stack2 = (stack2 === null || stack2 === undefined || stack2 === false ? stack2 : stack2.name);
    foundHelper = helpers.if_equals;
    stack3 = foundHelper || depth0.if_equals;
    tmp1 = self.program(5, program5, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.program(7, program7, data);
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n    <!-- LINK -->\n    \n  ";
    return buffer;}
  function program5(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n      <div class=\"square twitter\"> \n        <div class=\"tweet-container\">\n          <div class=\"inner\">\n            <div class=\"tweet\">";
    foundHelper = helpers.description_html;
    stack1 = foundHelper || depth0.description_html;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "description_html", { hash: {} }); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</div>\n            <div class=\"tweeter\">- ";
    foundHelper = helpers.twitter_handle_link;
    stack1 = foundHelper || depth0.twitter_handle_link;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "twitter_handle_link", { hash: {} }); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "</div>\n          </div>\n        </div>\n      </div>\n    ";
    return buffer;}

  function program7(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n      <a href=\"";
    foundHelper = helpers.source;
    stack1 = foundHelper || depth0.source;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "source.url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" class=\"external url\" target=\"_blank\">\n        <h2>";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</h2>\n      </a>\n    ";
    return buffer;}

  function program9(depth0,data) {
    
    var buffer = "", stack1, stack2, stack3;
    buffer += "\n    ";
    stack1 = "mp3";
    foundHelper = helpers.attachment;
    stack2 = foundHelper || depth0.attachment;
    stack2 = (stack2 === null || stack2 === undefined || stack2 === false ? stack2 : stack2.extension);
    foundHelper = helpers.if_equals;
    stack3 = foundHelper || depth0.if_equals;
    tmp1 = self.program(10, program10, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    if(foundHelper && typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, stack1, tmp1); }
    else { stack1 = blockHelperMissing.call(depth0, stack3, stack2, stack1, tmp1); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  ";
    return buffer;}
  function program10(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n      <div class=\"square sound\"> \n        <a href=\"";
    foundHelper = helpers.attachment;
    stack1 = foundHelper || depth0.attachment;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.url);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "attachment.url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">&nbsp;</a>\n        <span class=\"sound-title\">";
    foundHelper = helpers.title;
    stack1 = foundHelper || depth0.title;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "title", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</span>\n      </div>\n    ";
    return buffer;}

  function program12(depth0,data) {
    
    var buffer = "", stack1;
    buffer += "\n    <!-- MEDIA -->\n    ";
    foundHelper = helpers.embed;
    stack1 = foundHelper || depth0.embed;
    stack1 = (stack1 === null || stack1 === undefined || stack1 === false ? stack1 : stack1.html);
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "embed.html", { hash: {} }); }
    if(stack1 || stack1 === 0) { buffer += stack1; }
    buffer += "\n  ";
    return buffer;}

    buffer += "\n";
    foundHelper = helpers.blocks;
    stack1 = foundHelper || depth0.blocks;
    stack2 = helpers.each;
    tmp1 = self.program(1, program1, data);
    tmp1.hash = {};
    tmp1.fn = tmp1;
    tmp1.inverse = self.noop;
    stack1 = stack2.call(depth0, stack1, tmp1);
    if(stack1 || stack1 === 0) { buffer += stack1; }
    return buffer;});
}});

window.require.define({"views/templates/home": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var foundHelper, self=this;


    return "<div id=\"content\">\n\n</div>";});
}});

window.require.define({"views/view": function(exports, require, module) {
  var View,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  require('lib/view_helper');

  module.exports = View = (function(_super) {

    __extends(View, _super);

    function View() {
      this.render = __bind(this.render, this);
      return View.__super__.constructor.apply(this, arguments);
    }

    View.prototype.template = function() {};

    View.prototype.getRenderData = function() {};

    View.prototype.render = function() {
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };

    View.prototype.afterRender = function() {};

    return View;

  })(Backbone.View);
  
}});


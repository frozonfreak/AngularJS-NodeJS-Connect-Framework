var
    connectRoute = require('connect-route')
  , connectJade = require("connect-jade")
  , connect   = require('connect')
  , model     = require('model')
  , config    = require('./server/config')
  , module    = require('./server/modules')

    // Create a Connect app
    app = connect();

    // Configure the app
    app.use(connect.logger('short')); // Logs HTTP/HTTPS requests

    app.use(connect.favicon(__dirname + '/favicon.ico')); // Serve a favicon file
    app.use(connect.static(__dirname + '/public')); // Static file hosting from the `./public` directory
    app.use(connect.json()); // Parse JSON request body into `request.body`
    app.use(connect.urlencoded()); // Parse form in request body into `request.body`
    app.use(connect.cookieParser()); // Parse cookies in the request headers into `request.cookies`
    app.use(connect.bodyParser());
    app.use(connect.query()); // Parse query string into `request.query`
    app.use(connect.timeout(20000)); // Set maximum time to complete a request to 20 seconds (20000 ms)
    app.use(connectJade({root: __dirname + "/views",defaults: {title: "MyApp"}}));//Set Jade configurations

    //Create a model
    var User = function () {
      //Properties
      this.property('login', 'string', {required: true});
      this.property('password', 'string', {required: true});
      this.property('lastName', 'string');
      this.property('firstName', 'string');
      
      //Validations
      this.validatesPresent('login');
      this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
      this.validatesLength('login', {min: 3});
      this.validatesConfirmed('password', 'confirmPassword');
      this.validatesWithFunction('password', function (s) {
          // Something that returns true or false
          return s.length > 0;
      });

      // Can define methods for instances like this
      this.test = function () {
        // Do some stuff
      };
    };

    // Can also define them on the prototype
    User.prototype.someOtherMethod = function () {
      // Do some other stuff
    };

    //Register Model
    User = model.register('User', User);


  //Routing
  app.use(connectRoute(function (router) {
  //-----------------------------------------
  //  GET ROUTES
  //-----------------------------------------
    router.get('/', function (req, res, next) {
        res.render("index", { heading: "Welcome to My App" });
    });

    router.get('/home/:id', function (req, res, next) {
        res.end('home ' + req.params.id);
    });

    //-----------------------------------------
    //  POST ROUTES
    //-----------------------------------------
    router.post('/services', function (req, res, next) {
        //Only use in case of cross server access
        //res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        //All params under req.body
        
        switch(req.body.type)
        {
          case 'typeID':
            
            //Store values into model
            var params = {
              login: 'alex'
            , password: 'lerxst'
            , lastName: 'Lifeson'
            , firstName: 'Alex'
            };
            var user = User.create(params);

            console.log(user);
            res.end('home ' + req.body.type);
            //module.executeType(req,res);
          break;

        }
    });
  }));

  app.listen(3000);

  console.log('Server running...');
  console.log('localhost');
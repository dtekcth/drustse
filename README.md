
# drust.se web application

## Setup

1. Install nodejs and npm

2. Run `npm install`

3. Run `npm start` to start the server

## Usage

### Adding a user
To add a new user, use this command:
```
nodejs server.js --name=UserName --passw=Password
```

## Contribute

### Adding a view

1. Add new pug file in /views folder.

2. Add these lines:
  ```pug
  extends ./base.pug

  block title
      title= title
      
  block includes
      //- Include stylesheets or js files here

  block content
      article
          //- Add stuff here
  ```
3. In server.js add:
  ```javascript
  
  app.get('/$path',(req, res) => { res.render('$name', {title:'$title'}); });
  
  ```
  where 
  $path is the subfolder in the url that you want,
  $name is the name of the pug file,
  $title is the title you want for the view.

### About Javascript
Always 
``` javascript
  'use strict';
```
#### Declarations
If you know that your variable value won't change, declare it like this:
``` javascript
  const variable = 10;
```
otherwise
``` javascript
  let variable = 10;
```
Never use ```var```.

#### Javascript in script tags
Example:
```javascript    
script
  :babel
      class Person {
          constructor(name){
              this.name = name;
          }
      }
      var pers = new Person('taira');
      console.log(pers.name);
```

### About SCSS
Try to write your scss in a new file or in one existing that makes sense and then import the module to ```layout.scss```. Add an underscore as prefix to your .scss file, like ```_example.scss``` and then import it in ```layout.scss``` with 
```scss
  @import 'example'
```

For Sass/SCSS documentation:
[Doc](http://sass-lang.com/guide)


# drust.dtek.se web server

## Setup

1. Install nodejs and npm

2. Run `npm install`

3. Run `npm start` to start the server

## Contribute

### Adding a view

1. Add new pug file in /views folder.

2. Add these lines:
  ```pug
  extends ./base.pug

  block title
      title= title

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

### Javascript in script tags
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

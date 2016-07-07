# drust.dtek.se web server

## Setup

1. Install node and npm

2. Run `npm install`

3. Run `npm start` to start the server

## Contribute

### Javascript in pug files
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

[![npm version](https://badge.fury.io/js/trackable-object.svg)](https://badge.fury.io/js/trackable-object)
![example workflow](https://github.com/mahmoudshahin1111/trackable-object/actions/.github/workflows/main.yml/badge.svg)

# Trackable Object ***(Up your object limits 🐢)***

![banner500x500](https://user-images.githubusercontent.com/46138189/218281811-09448382-b37e-4df4-92fd-3eaac852c177.png)

Track object deeply 🔍 so you can check if it changed or any of it's nested properties had changed.

## Installation
### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/trackable-object@latest/build/trackable-object.js"></script>
```

### NPM
```bash
npm i trackable-object
```


## How it works?

```js

const {TrackableObject} = require('../dist/main');

const parentTO = TrackableObject({
    name:'parent_name'
});

parentTO.name = 'parent_name_updated';

console.log(trackableObject.t_changes()); //  Output: {name : 'parent_name_updated'}
console.log(JSON.stringify(person)); // and you can serialize your object as well 
```

## Use Cases:
- Check if the property changed before sending another request so will save the APIs cost.
- Warning the client before leaving regarding he can loss his changes.


Notes:
- If your object property get back to the old value then will not be exists in the `t_changes()` output.

## API

|   Name   |                  Description                   |            Type             |
| :------: | :--------------------------------------------: | :-------------------------: |
|  t_changes   |              Get all the changed properties               |           function():Map<string,string>            |



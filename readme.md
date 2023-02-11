# Trackable Object ***(Up your object limits 🐢)***

![banner500x500](https://user-images.githubusercontent.com/46138189/218281811-09448382-b37e-4df4-92fd-3eaac852c177.png)

Track object deeply 🔍 so you can check if it changed or any of it's nested properties had changed.



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

Notes:
- If your object property get back to the old value then will not be exists in the `t_changes()` output.

## API

|   Name   |                  Description                   |            Type             |
| :------: | :--------------------------------------------: | :-------------------------: |
|  t_changes   |              Get all the changed properties               |           Map<string,string>            |



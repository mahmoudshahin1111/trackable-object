# Trackable Object (Advance your javascript object)

![banner500x500](https://user-images.githubusercontent.com/46138189/218281811-09448382-b37e-4df4-92fd-3eaac852c177.png)

Track object deeply 🔍 so you can check if it changed or any of it's nested properties had changed.



How it works?

```js
const {TrackableObject} = require('../dist/main');

const parent = {
    name:'parent_name'
};

const parentTO = TrackableObject(parent);

parentTO.name = 'parent_name_updated';

console.log(trackableObject.t_changes()); //  Output: {name : 'parent_name_updated'}
```

let users = [{
    username: "nino1",
    age: 11
}, {
    username: "nino2",
    age: 12
}, {
    username: "nino3",
    age: 13
}];

/**
    This way, instead of using find, we can access the value associated with a key in our Map data structure 
    using get with a time complexity of O(1), independent of the size of the data. Moreover, using the has method, 
    we can check for the existence of that data with a time complexity of O(1) instead of using includes with a 
    time complexity of O(n). Keys are case-sensitive, which provides us with convenience.
**/

let objData = users.reduce((db, item) => (db[item.username] = item) && db, {});

/** Object maps **/

let hashData = new Map(users.map((user) => [user.username, user]));

// ------------------------------------------

console.log("objData", objData["nino1"]);
console.log("hashData", hashData.get("nino1"));
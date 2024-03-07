### Conceptual Exercise

Answer the following questions below:

- What are some ways of managing asynchronous code in JavaScript?

      Asynchronous code can be managed through callbacks; where a function(callback) is passed as an argument to another function. Promises, Async/Await, Event Emitters, and Generators are the other ways. 

- What is a Promise?

      A promise is a way to make multiple nested callbacks more readable and maintable. Promises represent the eventual completion or failure of an asynchronous operation and it's resulting value.

      A promise can be in one of three states: Pending, fulfilled, rejected.

      The `Promise ` constructor is to create a new Promise object. It takes a function as its argument, which in turn takes two parameters: `resolve` and  `reject`.


- What are the differences between an async function and a regular function?

      These functions differ in how they handle return values in an async operation. A regular function returns a value using the `return` keyword. An async function always returns a Promise. if the function explicitly returns a value, the Promise will be resolved with that value. If the function throws an excpetion, the Promise will be rejected with the thrown value. 

      Regular functions act synchronous. Async functions have access to the `await` keyword which allows a pause until a Promise is resolved or rejected. 

      Async Functions have greater error handling capabilities with `try`/ `catch`. Allowing for the code to continue throw the other values but throwing errors and returning the values that failed the try. Whereas regular functions would stop at the first value that failed. 

- What is the difference between Node.js and Express.js?

      Node.js is the engine and Express.js is an enhancement. Node.js provides javascript the capability to execute code on the server side. Express.js is a web app framework built on top of Node.js and is specifically for web applications, APIs and server-side logic. 

      Express is able to simply the process of handling HTTP reequests, defining routes, and managing middleware in Node.js apps.

      Node.js can be used beyond web development, including networking tools, automation scripts, and more.

- What is the error-first callback pattern?

      This is a convention widely used in Node.js for handling ansynchronous operations using callbacks. Developers can easily check for errors by examining the first parameter of the callback. 

- What is middleware?

      Middleware are functions that are executed between the receiving of a request and the sending of a response in the server-side processing of an application. This allows the functions to have access to the request and response objects.

- What does the `next` function do?

      The `next` function is a callback or signal inside of middleware functions. It will help pass control to the next middleware function in the stack or the final route handler. 

- What are some issues with the following code? (consider all aspects: performance, structure, naming, etc)

      We will first run into a bottleneck issue with the sequential requests to fetch user data as they are all independent. With `Promise.all` we can parallelize the requests. 

      There is no error handling and try-catch blocks should be implemented.

      Use descriptive variable names for the fetched data.

      The code is only viable for fetching three users. Let's consider allowing dynamic input for usernames or URLs

```js
// async function getUsers() {
//   const elie = await $.getJSON('https://api.github.com/users/elie');
//   const joel = await $.getJSON('https://api.github.com/users/joelburton');
//   const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

//   return [elie, matt, joel];
// }
   async function getUsers() {
    // Construct URLS based on usernames
    const userUrls = usernames.map(username => `https://api.github.com/users/${username}`);

    try {
      const userData = await Promise.all(userUrls.map(url => $.getJSON(url)));
      return userData;
    } catch(error) {
      console.error('Error fetching user data:', error);
      throw error; 
    }
   }

```
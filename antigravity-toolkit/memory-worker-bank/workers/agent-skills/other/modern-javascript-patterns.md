# modern-javascript-patterns
Source: https://antigravity.codes/agent-skills/other/modern-javascript-patterns

## AI Worker Instructions
When the user requests functionality related to modern-javascript-patterns, follow these guidelines and utilize this context.

## Scraped Content

# modern-javascript-patterns
```
// Traditional functionfunction add(a, b) {  return a + b;}// Arrow functionconst add = (a, b) => a + b;// Single parameter (parentheses optional)const double = (x) => x * 2;// No parametersconst getRandom = () => Math.random();// Multiple statements (need curly braces)const processUser = (user) => {  const normalized = user.name.toLowerCase();  return { ...user, name: normalized };};// Returning objects (wrap in parentheses)const createUser = (name, age) => ({ name, age });
```
```
// Traditional functionfunction add(a, b) {  return a + b;}// Arrow functionconst add = (a, b) => a + b;// Single parameter (parentheses optional)const double = (x) => x * 2;// No parametersconst getRandom = () => Math.random();// Multiple statements (need curly braces)const processUser = (user) => {  const normalized = user.name.toLowerCase();  return { ...user, name: normalized };};// Returning objects (wrap in parentheses)const createUser = (name, age) => ({ name, age });
```
```
class Counter {  constructor() {    this.count = 0;  }  // Arrow function preserves 'this' context  increment = () => {    this.count++;  };  // Traditional function loses 'this' in callbacks  incrementTraditional() {    setTimeout(function () {      this.count++; // 'this' is undefined    }, 1000);  }  // Arrow function maintains 'this'  incrementArrow() {    setTimeout(() => {      this.count++; // 'this' refers to Counter instance    }, 1000);  }}
```
```
class Counter {  constructor() {    this.count = 0;  }  // Arrow function preserves 'this' context  increment = () => {    this.count++;  };  // Traditional function loses 'this' in callbacks  incrementTraditional() {    setTimeout(function () {      this.count++; // 'this' is undefined    }, 1000);  }  // Arrow function maintains 'this'  incrementArrow() {    setTimeout(() => {      this.count++; // 'this' refers to Counter instance    }, 1000);  }}
```
```
const user = {  id: 1,  name: "John Doe",  email: "john@example.com",  address: {    city: "New York",    country: "USA",  },};// Basic destructuringconst { name, email } = user;// Rename variablesconst { name: userName, email: userEmail } = user;// Default valuesconst { age = 25 } = user;// Nested destructuringconst {  address: { city, country },} = user;// Rest operatorconst { id, ...userWithoutId } = user;// Function parametersfunction greet({ name, age = 18 }) {  console.log(Hello ${name}, you are ${age});}greet(user);
```
```
const user = {  id: 1,  name: "John Doe",  email: "john@example.com",  address: {    city: "New York",    country: "USA",  },};// Basic destructuringconst { name, email } = user;// Rename variablesconst { name: userName, email: userEmail } = user;// Default valuesconst { age = 25 } = user;// Nested destructuringconst {  address: { city, country },} = user;// Rest operatorconst { id, ...userWithoutId } = user;// Function parametersfunction greet({ name, age = 18 }) {  console.log(Hello ${name}, you are ${age});}greet(user);
```
```
Hello ${name}, you are ${age}
```
```
const numbers = [1, 2, 3, 4, 5];// Basic destructuringconst [first, second] = numbers;// Skip elementsconst [, , third] = numbers;// Rest operatorconst [head, ...tail] = numbers;// Swapping variableslet a = 1,  b = 2;[a, b] = [b, a];// Function return valuesfunction getCoordinates() {  return [10, 20];}const [x, y] = getCoordinates();// Default valuesconst [one, two, three = 0] = [1, 2];
```
```
const numbers = [1, 2, 3, 4, 5];// Basic destructuringconst [first, second] = numbers;// Skip elementsconst [, , third] = numbers;// Rest operatorconst [head, ...tail] = numbers;// Swapping variableslet a = 1,  b = 2;[a, b] = [b, a];// Function return valuesfunction getCoordinates() {  return [10, 20];}const [x, y] = getCoordinates();// Default valuesconst [one, two, three = 0] = [1, 2];
```
```
// Array spreadingconst arr1 = [1, 2, 3];const arr2 = [4, 5, 6];const combined = [...arr1, ...arr2];// Object spreadingconst defaults = { theme: "dark", lang: "en" };const userPrefs = { theme: "light" };const settings = { ...defaults, ...userPrefs };// Function argumentsconst numbers = [1, 2, 3];Math.max(...numbers);// Copying arrays/objects (shallow copy)const copy = [...arr1];const objCopy = { ...user };// Adding items immutablyconst newArr = [...arr1, 4, 5];const newObj = { ...user, age: 30 };
```
```
// Array spreadingconst arr1 = [1, 2, 3];const arr2 = [4, 5, 6];const combined = [...arr1, ...arr2];// Object spreadingconst defaults = { theme: "dark", lang: "en" };const userPrefs = { theme: "light" };const settings = { ...defaults, ...userPrefs };// Function argumentsconst numbers = [1, 2, 3];Math.max(...numbers);// Copying arrays/objects (shallow copy)const copy = [...arr1];const objCopy = { ...user };// Adding items immutablyconst newArr = [...arr1, 4, 5];const newObj = { ...user, age: 30 };
```
```
// Collect function argumentsfunction sum(...numbers) {  return numbers.reduce((total, num) => total + num, 0);}sum(1, 2, 3, 4, 5);// With regular parametersfunction greet(greeting, ...names) {  return ${greeting} ${names.join(", ")};}greet("Hello", "John", "Jane", "Bob");// Object restconst { id, ...userData } = user;// Array restconst [first, ...rest] = [1, 2, 3, 4, 5];
```
```
// Collect function argumentsfunction sum(...numbers) {  return numbers.reduce((total, num) => total + num, 0);}sum(1, 2, 3, 4, 5);// With regular parametersfunction greet(greeting, ...names) {  return ${greeting} ${names.join(", ")};}greet("Hello", "John", "Jane", "Bob");// Object restconst { id, ...userData } = user;// Array restconst [first, ...rest] = [1, 2, 3, 4, 5];
```
```
${greeting} ${names.join(", ")}
```
```
// Basic usageconst name = "John";const greeting = Hello, ${name}!;// Multi-line stringsconst html =   <div>    <h1>${title}</h1>    <p>${content}</p>  </div>;// Expression evaluationconst price = 19.99;const total = Total: $${(price * 1.2).toFixed(2)};// Tagged template literalsfunction highlight(strings, ...values) {  return strings.reduce((result, str, i) => {    const value = values[i] || "";    return result + str + <mark>${value}</mark>;  }, "");}const name = "John";const age = 30;const html = highlightName: ${name}, Age: ${age};// Output: "Name: <mark>John</mark>, Age: <mark>30</mark>"
```
```
// Basic usageconst name = "John";const greeting = Hello, ${name}!;// Multi-line stringsconst html =   <div>    <h1>${title}</h1>    <p>${content}</p>  </div>;// Expression evaluationconst price = 19.99;const total = Total: $${(price * 1.2).toFixed(2)};// Tagged template literalsfunction highlight(strings, ...values) {  return strings.reduce((result, str, i) => {    const value = values[i] || "";    return result + str + <mark>${value}</mark>;  }, "");}const name = "John";const age = 30;const html = highlightName: ${name}, Age: ${age};// Output: "Name: <mark>John</mark>, Age: <mark>30</mark>"
```
```
Hello, ${name}!
```
```
<div>    <h1>${title}</h1>    <p>${content}</p>  </div>
```
```
Total: $${(price * 1.2).toFixed(2)}
```
```
<mark>${value}</mark>
```
```
Name: ${name}, Age: ${age}
```
```
const name = "John";const age = 30;// Shorthand property namesconst user = { name, age };// Shorthand method namesconst calculator = {  add(a, b) {    return a + b;  },  subtract(a, b) {    return a - b;  },};// Computed property namesconst field = "email";const user = {  name: "John",  [field]: "john@example.com",  [get${field.charAt(0).toUpperCase()}${field.slice(1)}]() {    return this[field];  },};// Dynamic property creationconst createUser = (name, ...props) => {  return props.reduce(    (user, [key, value]) => ({      ...user,      [key]: value,    }),    { name },  );};const user = createUser("John", ["age", 30], ["email", "john@example.com"]);
```
```
const name = "John";const age = 30;// Shorthand property namesconst user = { name, age };// Shorthand method namesconst calculator = {  add(a, b) {    return a + b;  },  subtract(a, b) {    return a - b;  },};// Computed property namesconst field = "email";const user = {  name: "John",  [field]: "john@example.com",  [get${field.charAt(0).toUpperCase()}${field.slice(1)}]() {    return this[field];  },};// Dynamic property creationconst createUser = (name, ...props) => {  return props.reduce(    (user, [key, value]) => ({      ...user,      [key]: value,    }),    { name },  );};const user = createUser("John", ["age", 30], ["email", "john@example.com"]);
```
```
get${field.charAt(0).toUpperCase()}${field.slice(1)}
```
```
// Creating a promiseconst fetchUser = (id) => {  return new Promise((resolve, reject) => {    setTimeout(() => {      if (id > 0) {        resolve({ id, name: "John" });      } else {        reject(new Error("Invalid ID"));      }    }, 1000);  });};// Using promisesfetchUser(1)  .then((user) => console.log(user))  .catch((error) => console.error(error))  .finally(() => console.log("Done"));// Chaining promisesfetchUser(1)  .then((user) => fetchUserPosts(user.id))  .then((posts) => processPosts(posts))  .then((result) => console.log(result))  .catch((error) => console.error(error));
```
```
// Creating a promiseconst fetchUser = (id) => {  return new Promise((resolve, reject) => {    setTimeout(() => {      if (id > 0) {        resolve({ id, name: "John" });      } else {        reject(new Error("Invalid ID"));      }    }, 1000);  });};// Using promisesfetchUser(1)  .then((user) => console.log(user))  .catch((error) => console.error(error))  .finally(() => console.log("Done"));// Chaining promisesfetchUser(1)  .then((user) => fetchUserPosts(user.id))  .then((posts) => processPosts(posts))  .then((result) => console.log(result))  .catch((error) => console.error(error));
```
```
// Promise.all - Wait for all promisesconst promises = [fetchUser(1), fetchUser(2), fetchUser(3)];Promise.all(promises)  .then((users) => console.log(users))  .catch((error) => console.error("At least one failed:", error));// Promise.allSettled - Wait for all, regardless of outcomePromise.allSettled(promises).then((results) => {  results.forEach((result) => {    if (result.status === "fulfilled") {      console.log("Success:", result.value);    } else {      console.log("Error:", result.reason);    }  });});// Promise.race - First to completePromise.race(promises)  .then((winner) => console.log("First:", winner))  .catch((error) => console.error(error));// Promise.any - First to succeedPromise.any(promises)  .then((first) => console.log("First success:", first))  .catch((error) => console.error("All failed:", error));
```
```
// Promise.all - Wait for all promisesconst promises = [fetchUser(1), fetchUser(2), fetchUser(3)];Promise.all(promises)  .then((users) => console.log(users))  .catch((error) => console.error("At least one failed:", error));// Promise.allSettled - Wait for all, regardless of outcomePromise.allSettled(promises).then((results) => {  results.forEach((result) => {    if (result.status === "fulfilled") {      console.log("Success:", result.value);    } else {      console.log("Error:", result.reason);    }  });});// Promise.race - First to completePromise.race(promises)  .then((winner) => console.log("First:", winner))  .catch((error) => console.error(error));// Promise.any - First to succeedPromise.any(promises)  .then((first) => console.log("First success:", first))  .catch((error) => console.error("All failed:", error));
```
```
// Async function always returns a Promiseasync function fetchUser(id) {  const response = await fetch(/api/users/${id});  const user = await response.json();  return user;}// Error handling with try/catchasync function getUserData(id) {  try {    const user = await fetchUser(id);    const posts = await fetchUserPosts(user.id);    return { user, posts };  } catch (error) {    console.error("Error fetching data:", error);    throw error;  }}// Sequential vs Parallel executionasync function sequential() {  const user1 = await fetchUser(1); // Wait  const user2 = await fetchUser(2); // Then wait  return [user1, user2];}async function parallel() {  const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(2)]);  return [user1, user2];}
```
```
// Async function always returns a Promiseasync function fetchUser(id) {  const response = await fetch(/api/users/${id});  const user = await response.json();  return user;}// Error handling with try/catchasync function getUserData(id) {  try {    const user = await fetchUser(id);    const posts = await fetchUserPosts(user.id);    return { user, posts };  } catch (error) {    console.error("Error fetching data:", error);    throw error;  }}// Sequential vs Parallel executionasync function sequential() {  const user1 = await fetchUser(1); // Wait  const user2 = await fetchUser(2); // Then wait  return [user1, user2];}async function parallel() {  const [user1, user2] = await Promise.all([fetchUser(1), fetchUser(2)]);  return [user1, user2];}
```
```
/api/users/${id}
```
```
// Async IIFE(async () => {  const result = await someAsyncOperation();  console.log(result);})();// Async iterationasync function processUsers(userIds) {  for (const id of userIds) {    const user = await fetchUser(id);    await processUser(user);  }}// Top-level await (ES2022)const config = await fetch("/config.json").then((r) => r.json());// Retry logicasync function fetchWithRetry(url, retries = 3) {  for (let i = 0; i < retries; i++) {    try {      return await fetch(url);    } catch (error) {      if (i === retries - 1) throw error;      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));    }  }}// Timeout wrapperasync function withTimeout(promise, ms) {  const timeout = new Promise((_, reject) =>    setTimeout(() => reject(new Error("Timeout")), ms),  );  return Promise.race([promise, timeout]);}
```
```
// Async IIFE(async () => {  const result = await someAsyncOperation();  console.log(result);})();// Async iterationasync function processUsers(userIds) {  for (const id of userIds) {    const user = await fetchUser(id);    await processUser(user);  }}// Top-level await (ES2022)const config = await fetch("/config.json").then((r) => r.json());// Retry logicasync function fetchWithRetry(url, retries = 3) {  for (let i = 0; i < retries; i++) {    try {      return await fetch(url);    } catch (error) {      if (i === retries - 1) throw error;      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));    }  }}// Timeout wrapperasync function withTimeout(promise, ms) {  const timeout = new Promise((_, reject) =>    setTimeout(() => reject(new Error("Timeout")), ms),  );  return Promise.race([promise, timeout]);}
```
```
const users = [  { id: 1, name: "John", age: 30, active: true },  { id: 2, name: "Jane", age: 25, active: false },  { id: 3, name: "Bob", age: 35, active: true },];// Map - Transform arrayconst names = users.map((user) => user.name);const upperNames = users.map((user) => user.name.toUpperCase());// Filter - Select elementsconst activeUsers = users.filter((user) => user.active);const adults = users.filter((user) => user.age >= 18);// Reduce - Aggregate dataconst totalAge = users.reduce((sum, user) => sum + user.age, 0);const avgAge = totalAge / users.length;// Group by propertyconst byActive = users.reduce((groups, user) => {  const key = user.active ? "active" : "inactive";  return {    ...groups,    [key]: [...(groups[key] || []), user],  };}, {});// Chaining methodsconst result = users  .filter((user) => user.active)  .map((user) => user.name)  .sort()  .join(", ");
```
```
const users = [  { id: 1, name: "John", age: 30, active: true },  { id: 2, name: "Jane", age: 25, active: false },  { id: 3, name: "Bob", age: 35, active: true },];// Map - Transform arrayconst names = users.map((user) => user.name);const upperNames = users.map((user) => user.name.toUpperCase());// Filter - Select elementsconst activeUsers = users.filter((user) => user.active);const adults = users.filter((user) => user.age >= 18);// Reduce - Aggregate dataconst totalAge = users.reduce((sum, user) => sum + user.age, 0);const avgAge = totalAge / users.length;// Group by propertyconst byActive = users.reduce((groups, user) => {  const key = user.active ? "active" : "inactive";  return {    ...groups,    [key]: [...(groups[key] || []), user],  };}, {});// Chaining methodsconst result = users  .filter((user) => user.active)  .map((user) => user.name)  .sort()  .join(", ");
```
```
// Find - First matching elementconst user = users.find((u) => u.id === 2);// FindIndex - Index of first matchconst index = users.findIndex((u) => u.name === "Jane");// Some - At least one matchesconst hasActive = users.some((u) => u.active);// Every - All matchconst allAdults = users.every((u) => u.age >= 18);// FlatMap - Map and flattenconst userTags = [  { name: "John", tags: ["admin", "user"] },  { name: "Jane", tags: ["user"] },];const allTags = userTags.flatMap((u) => u.tags);// From - Create array from iterableconst str = "hello";const chars = Array.from(str);const numbers = Array.from({ length: 5 }, (_, i) => i + 1);// Of - Create array from argumentsconst arr = Array.of(1, 2, 3);
```
```
// Find - First matching elementconst user = users.find((u) => u.id === 2);// FindIndex - Index of first matchconst index = users.findIndex((u) => u.name === "Jane");// Some - At least one matchesconst hasActive = users.some((u) => u.active);// Every - All matchconst allAdults = users.every((u) => u.age >= 18);// FlatMap - Map and flattenconst userTags = [  { name: "John", tags: ["admin", "user"] },  { name: "Jane", tags: ["user"] },];const allTags = userTags.flatMap((u) => u.tags);// From - Create array from iterableconst str = "hello";const chars = Array.from(str);const numbers = Array.from({ length: 5 }, (_, i) => i + 1);// Of - Create array from argumentsconst arr = Array.of(1, 2, 3);
```
```
// Custom forEachfunction forEach(array, callback) {  for (let i = 0; i < array.length; i++) {    callback(array[i], i, array);  }}// Custom mapfunction map(array, transform) {  const result = [];  for (const item of array) {    result.push(transform(item));  }  return result;}// Custom filterfunction filter(array, predicate) {  const result = [];  for (const item of array) {    if (predicate(item)) {      result.push(item);    }  }  return result;}
```
```
// Custom forEachfunction forEach(array, callback) {  for (let i = 0; i < array.length; i++) {    callback(array[i], i, array);  }}// Custom mapfunction map(array, transform) {  const result = [];  for (const item of array) {    result.push(transform(item));  }  return result;}// Custom filterfunction filter(array, predicate) {  const result = [];  for (const item of array) {    if (predicate(item)) {      result.push(item);    }  }  return result;}
```
```
// Curryingconst multiply = (a) => (b) => a * b;const double = multiply(2);const triple = multiply(3);console.log(double(5)); // 10console.log(triple(5)); // 15// Partial applicationfunction partial(fn, ...args) {  return (...moreArgs) => fn(...args, ...moreArgs);}const add = (a, b, c) => a + b + c;const add5 = partial(add, 5);console.log(add5(3, 2)); // 10// Memoizationfunction memoize(fn) {  const cache = new Map();  return (...args) => {    const key = JSON.stringify(args);    if (cache.has(key)) {      return cache.get(key);    }    const result = fn(...args);    cache.set(key, result);    return result;  };}const fibonacci = memoize((n) => {  if (n <= 1) return n;  return fibonacci(n - 1) + fibonacci(n - 2);});
```
```
// Curryingconst multiply = (a) => (b) => a * b;const double = multiply(2);const triple = multiply(3);console.log(double(5)); // 10console.log(triple(5)); // 15// Partial applicationfunction partial(fn, ...args) {  return (...moreArgs) => fn(...args, ...moreArgs);}const add = (a, b, c) => a + b + c;const add5 = partial(add, 5);console.log(add5(3, 2)); // 10// Memoizationfunction memoize(fn) {  const cache = new Map();  return (...args) => {    const key = JSON.stringify(args);    if (cache.has(key)) {      return cache.get(key);    }    const result = fn(...args);    cache.set(key, result);    return result;  };}const fibonacci = memoize((n) => {  if (n <= 1) return n;  return fibonacci(n - 1) + fibonacci(n - 2);});
```
```
// Function compositionconst compose =  (...fns) =>  (x) =>    fns.reduceRight((acc, fn) => fn(acc), x);const pipe =  (...fns) =>  (x) =>    fns.reduce((acc, fn) => fn(acc), x);// Example usageconst addOne = (x) => x + 1;const double = (x) => x * 2;const square = (x) => x * x;const composed = compose(square, double, addOne);console.log(composed(3)); // ((3 + 1) * 2)^2 = 64const piped = pipe(addOne, double, square);console.log(piped(3)); // ((3 + 1) * 2)^2 = 64// Practical exampleconst processUser = pipe(  (user) => ({ ...user, name: user.name.trim() }),  (user) => ({ ...user, email: user.email.toLowerCase() }),  (user) => ({ ...user, age: parseInt(user.age) }),);const user = processUser({  name: "  John  ",  email: "JOHN@EXAMPLE.COM",  age: "30",});
```
```
// Function compositionconst compose =  (...fns) =>  (x) =>    fns.reduceRight((acc, fn) => fn(acc), x);const pipe =  (...fns) =>  (x) =>    fns.reduce((acc, fn) => fn(acc), x);// Example usageconst addOne = (x) => x + 1;const double = (x) => x * 2;const square = (x) => x * x;const composed = compose(square, double, addOne);console.log(composed(3)); // ((3 + 1) * 2)^2 = 64const piped = pipe(addOne, double, square);console.log(piped(3)); // ((3 + 1) * 2)^2 = 64// Practical exampleconst processUser = pipe(  (user) => ({ ...user, name: user.name.trim() }),  (user) => ({ ...user, email: user.email.toLowerCase() }),  (user) => ({ ...user, age: parseInt(user.age) }),);const user = processUser({  name: "  John  ",  email: "JOHN@EXAMPLE.COM",  age: "30",});
```
```
// Impure function (modifies input)function addItemImpure(cart, item) {  cart.items.push(item);  cart.total += item.price;  return cart;}// Pure function (no side effects)function addItemPure(cart, item) {  return {    ...cart,    items: [...cart.items, item],    total: cart.total + item.price,  };}// Immutable array operationsconst numbers = [1, 2, 3, 4, 5];// Add to arrayconst withSix = [...numbers, 6];// Remove from arrayconst withoutThree = numbers.filter((n) => n !== 3);// Update array elementconst doubled = numbers.map((n) => (n === 3 ? n * 2 : n));// Immutable object operationsconst user = { name: "John", age: 30 };// Update propertyconst olderUser = { ...user, age: 31 };// Add propertyconst withEmail = { ...user, email: "john@example.com" };// Remove propertyconst { age, ...withoutAge } = user;// Deep cloning (simple approach)const deepClone = (obj) => JSON.parse(JSON.stringify(obj));// Better deep cloningconst structuredClone = (obj) => globalThis.structuredClone(obj);
```
```
// Impure function (modifies input)function addItemImpure(cart, item) {  cart.items.push(item);  cart.total += item.price;  return cart;}// Pure function (no side effects)function addItemPure(cart, item) {  return {    ...cart,    items: [...cart.items, item],    total: cart.total + item.price,  };}// Immutable array operationsconst numbers = [1, 2, 3, 4, 5];// Add to arrayconst withSix = [...numbers, 6];// Remove from arrayconst withoutThree = numbers.filter((n) => n !== 3);// Update array elementconst doubled = numbers.map((n) => (n === 3 ? n * 2 : n));// Immutable object operationsconst user = { name: "John", age: 30 };// Update propertyconst olderUser = { ...user, age: 31 };// Add propertyconst withEmail = { ...user, email: "john@example.com" };// Remove propertyconst { age, ...withoutAge } = user;// Deep cloning (simple approach)const deepClone = (obj) => JSON.parse(JSON.stringify(obj));// Better deep cloningconst structuredClone = (obj) => globalThis.structuredClone(obj);
```
```
// Class syntaxclass User {  // Private fields  #password;  // Public fields  id;  name;  // Static field  static count = 0;  constructor(id, name, password) {    this.id = id;    this.name = name;    this.#password = password;    User.count++;  }  // Public method  greet() {    return Hello, ${this.name};  }  // Private method  #hashPassword(password) {    return hashed_${password};  }  // Getter  get displayName() {    return this.name.toUpperCase();  }  // Setter  set password(newPassword) {    this.#password = this.#hashPassword(newPassword);  }  // Static method  static create(id, name, password) {    return new User(id, name, password);  }}// Inheritanceclass Admin extends User {  constructor(id, name, password, role) {    super(id, name, password);    this.role = role;  }  greet() {    return ${super.greet()}, I'm an admin;  }}
```
```
// Class syntaxclass User {  // Private fields  #password;  // Public fields  id;  name;  // Static field  static count = 0;  constructor(id, name, password) {    this.id = id;    this.name = name;    this.#password = password;    User.count++;  }  // Public method  greet() {    return Hello, ${this.name};  }  // Private method  #hashPassword(password) {    return hashed_${password};  }  // Getter  get displayName() {    return this.name.toUpperCase();  }  // Setter  set password(newPassword) {    this.#password = this.#hashPassword(newPassword);  }  // Static method  static create(id, name, password) {    return new User(id, name, password);  }}// Inheritanceclass Admin extends User {  constructor(id, name, password, role) {    super(id, name, password);    this.role = role;  }  greet() {    return ${super.greet()}, I'm an admin;  }}
```
```
Hello, ${this.name}
```
```
hashed_${password}
```
```
${super.greet()}, I'm an admin
```
```
// Exporting// math.jsexport const PI = 3.14159;export function add(a, b) {  return a + b;}export class Calculator {  // ...}// Default exportexport default function multiply(a, b) {  return a * b;}// Importing// app.jsimport multiply, { PI, add, Calculator } from "./math.js";// Rename importsimport { add as sum } from "./math.js";// Import allimport * as Math from "./math.js";// Dynamic importsconst module = await import("./math.js");const { add } = await import("./math.js");// Conditional loadingif (condition) {  const module = await import("./feature.js");  module.init();}
```
```
// Exporting// math.jsexport const PI = 3.14159;export function add(a, b) {  return a + b;}export class Calculator {  // ...}// Default exportexport default function multiply(a, b) {  return a * b;}// Importing// app.jsimport multiply, { PI, add, Calculator } from "./math.js";// Rename importsimport { add as sum } from "./math.js";// Import allimport * as Math from "./math.js";// Dynamic importsconst module = await import("./math.js");const { add } = await import("./math.js");// Conditional loadingif (condition) {  const module = await import("./feature.js");  module.init();}
```
```
// Custom iteratorconst range = {  from: 1,  to: 5,  [Symbol.iterator]() {    return {      current: this.from,      last: this.to,      next() {        if (this.current <= this.last) {          return { done: false, value: this.current++ };        } else {          return { done: true };        }      },    };  },};for (const num of range) {  console.log(num); // 1, 2, 3, 4, 5}// Generator functionfunction* rangeGenerator(from, to) {  for (let i = from; i <= to; i++) {    yield i;  }}for (const num of rangeGenerator(1, 5)) {  console.log(num);}// Infinite generatorfunction* fibonacci() {  let [prev, curr] = [0, 1];  while (true) {    yield curr;    [prev, curr] = [curr, prev + curr];  }}// Async generatorasync function* fetchPages(url) {  let page = 1;  while (true) {    const response = await fetch(${url}?page=${page});    const data = await response.json();    if (data.length === 0) break;    yield data;    page++;  }}for await (const page of fetchPages("/api/users")) {  console.log(page);}
```
```
// Custom iteratorconst range = {  from: 1,  to: 5,  [Symbol.iterator]() {    return {      current: this.from,      last: this.to,      next() {        if (this.current <= this.last) {          return { done: false, value: this.current++ };        } else {          return { done: true };        }      },    };  },};for (const num of range) {  console.log(num); // 1, 2, 3, 4, 5}// Generator functionfunction* rangeGenerator(from, to) {  for (let i = from; i <= to; i++) {    yield i;  }}for (const num of rangeGenerator(1, 5)) {  console.log(num);}// Infinite generatorfunction* fibonacci() {  let [prev, curr] = [0, 1];  while (true) {    yield curr;    [prev, curr] = [curr, prev + curr];  }}// Async generatorasync function* fetchPages(url) {  let page = 1;  while (true) {    const response = await fetch(${url}?page=${page});    const data = await response.json();    if (data.length === 0) break;    yield data;    page++;  }}for await (const page of fetchPages("/api/users")) {  console.log(page);}
```
```
${url}?page=${page}
```
```
// Optional chainingconst user = { name: "John", address: { city: "NYC" } };const city = user?.address?.city;const zipCode = user?.address?.zipCode; // undefined// Function callconst result = obj.method?.();// Array accessconst first = arr?.[0];// Nullish coalescingconst value = null ?? "default"; // 'default'const value = undefined ?? "default"; // 'default'const value = 0 ?? "default"; // 0 (not 'default')const value = "" ?? "default"; // '' (not 'default')// Logical assignmentlet a = null;a ??= "default"; // a = 'default'let b = 5;b ??= 10; // b = 5 (unchanged)let obj = { count: 0 };obj.count ||= 1; // obj.count = 1obj.count &&= 2; // obj.count = 2
```
```
// Optional chainingconst user = { name: "John", address: { city: "NYC" } };const city = user?.address?.city;const zipCode = user?.address?.zipCode; // undefined// Function callconst result = obj.method?.();// Array accessconst first = arr?.[0];// Nullish coalescingconst value = null ?? "default"; // 'default'const value = undefined ?? "default"; // 'default'const value = 0 ?? "default"; // 0 (not 'default')const value = "" ?? "default"; // '' (not 'default')// Logical assignmentlet a = null;a ??= "default"; // a = 'default'let b = 5;b ??= 10; // b = 5 (unchanged)let obj = { count: 0 };obj.count ||= 1; // obj.count = 1obj.count &&= 2; // obj.count = 2
```
```
// Debouncefunction debounce(fn, delay) {  let timeoutId;  return (...args) => {    clearTimeout(timeoutId);    timeoutId = setTimeout(() => fn(...args), delay);  };}const searchDebounced = debounce(search, 300);// Throttlefunction throttle(fn, limit) {  let inThrottle;  return (...args) => {    if (!inThrottle) {      fn(...args);      inThrottle = true;      setTimeout(() => (inThrottle = false), limit);    }  };}const scrollThrottled = throttle(handleScroll, 100);// Lazy evaluationfunction* lazyMap(iterable, transform) {  for (const item of iterable) {    yield transform(item);  }}// Use only what you needconst numbers = [1, 2, 3, 4, 5];const doubled = lazyMap(numbers, (x) => x * 2);const first = doubled.next().value; // Only computes first value
```
```
// Debouncefunction debounce(fn, delay) {  let timeoutId;  return (...args) => {    clearTimeout(timeoutId);    timeoutId = setTimeout(() => fn(...args), delay);  };}const searchDebounced = debounce(search, 300);// Throttlefunction throttle(fn, limit) {  let inThrottle;  return (...args) => {    if (!inThrottle) {      fn(...args);      inThrottle = true;      setTimeout(() => (inThrottle = false), limit);    }  };}const scrollThrottled = throttle(handleScroll, 100);// Lazy evaluationfunction* lazyMap(iterable, transform) {  for (const item of iterable) {    yield transform(item);  }}// Use only what you needconst numbers = [1, 2, 3, 4, 5];const doubled = lazyMap(numbers, (x) => x * 2);const first = doubled.next().value; // Only computes first value
```
```
'use strict'
```
This skill empowers developers to transition from traditional JavaScript paradigms to cutting-edge ES6+ best practices. Dive deep into asynchronous programming with `async/await` and Promises, streamline data handling with destructuring and spread operators, and embrace the conciseness of arrow functions. It's designed to help you write highly maintainable, performant, and future-proof code, moving beyond legacy practices to leverage the full power of modern JavaScript for any web or backend application. Unlock efficiency and elegance in your daily coding workflow.

# When to Use This Skill
- •Refactoring older JavaScript codebases to leverage modern ES6+ syntax.
- •Implementing robust asynchronous logic using Promises and async/await.
- •Optimizing JavaScript applications for better performance and readability.
- •Developing new features with a functional programming approach.

# Pro Tips
- 💡Always prioritize readability over extreme conciseness with arrow functions, especially for complex logic or when debugging.
- 💡When working with Promises and `async/await`, ensure proper error handling using `try...catch` blocks or `.catch()` to prevent unhandled rejections.
- 💡Leverage destructuring not just for objects and arrays, but also in function parameters to make their expected inputs clearer and cleaner.


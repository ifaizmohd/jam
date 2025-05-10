# jam

JAM stands for Javascript API Manager.

### Purpose.

JAM is build to make cross platform api requests from Browsers, NodeJs servers and React Native.

### Benefits:

1. Node.js compatibility
2. Browser support
3. Same API across platforms

# Get Started

## Installation

`npm install jam`

# Basic Usage

Create a new Jam client for your application to make API calls.

`const client = new Jam('https://api.jam.com');`

It accepts baseURL, which will be using in all requests.

Jam class gives access to different HTTP methods which can be used to make API calls.

1. # Get

Execute GET request, returns a Promise

`client.get('/examplePath')`

get method accepts 3 parameters, out of which one is mandatory, which is url or path, and other two are optional.

| Param | type | optional

---

| url | string | No
| payload | any | Yes
| queryParams | Object | Yes

Get request with payload and query params would looks like -

`client.get('/examplePath', {test: 'test'}, {page: 1})`

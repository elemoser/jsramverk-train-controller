# Repository *jsramverk-train-controller*

This is the repository for the course *jsramverk* (h23).
It is maintained by *elmo22* and *poak22*.

The application can be found here: [Train-controller](https://www.student.bth.se/~elmo22/train/). And the backend can be found here: [Backend](https://jsramverk-train-poak22-elmo22.azurewebsites.net/).

## How to use this repo

```
# To initialze the application, run the following script from root folder in repo.
bash setup_app.bash
```

An .env file is needed in the /backend folder with API-key, see *.env.example* for structure.

When developing, both, the backend and frontend, need to be started locally. This will run backend and frontend in the development environment, which won't effect the database used in the deployed application. When starting frontend in development the URL 'localhost:1337' is used to fetch data, where backend then uses it's own database 'development' in the Atlas Cloud.

```
# Run backend from /backend folder
npm run start-dev
```

```
# Run frontend from /frontend-vue folder
npm run dev
```
### Reset development database

If needed during development, the development database can be reset.

```
# To reset the development database, stand in /backend folder.
npm run dev-reset-db
```

### Tests

Test can be run for both backend and frontend.

#### Backend

Mocha together with chai is used for backend testing. Testing is done on a it's own database called 'test' that is set-up in the Atlas Cloud. The command below is also the command used in github actions for continuous integration.

```
# Stand in /backend folder.
npm run test
```

#### Frontend (Vue)

For frontend testing cypress is used for end to end testing. Testing uses the API and also the 'test' database in the Atlas Cloud. The backend needs to be started locally in 'test-mode'. To run the test the commands below is needed to be run, which is also the way it's done during continuous integration.

```
# Stand in /backend folder.
npm run start-test

# Start the front-end server from /frontend-vue
npm run dev

# Then run the test from /frontend-vue
npm run cy:run --e2e
```

### Deploying the app
The backend is deployed in the Azure Cloud, and can be found here: [Backend](https://jsramverk-train-poak22-elmo22.azurewebsites.net/).

Deploying the frontend is done with rsync and put on the BTH:s student server. Using Vue and vue-router a root specific root needs to be setup before deploying the application. In the '/frontend-vue/src/router/index.js' the 'createWebHistory()' needs to have the correct root. In our case '/~elmo22/train/'. The deployed application can be found here: [Frontend](https://www.student.bth.se/~elmo22/train/).

```
# Deploy the frontend from /frontend-vue
npm run deploy
```


## Steps to make backend work locally from original repo

### Backend

Created account [Trafikverket](https://api.trafikinfo.trafikverket.se/) to receive a personal API key, then create an .env file, following the template in .env.example, and store your API key in that file.

```
# When opening the repo for the first time, stand in the folder /backend.
# Make sure node and npm are installed
# Then install the dependencies in the local node_modules folder
node -v
npm -v
npm install

# To reset the database the following command was needed from the folder /backend:
bash db/reset_db.bash
```

#### Start app

```
# To run the app from /backend folder (using a npm-script)
npm run start-dev
```

#### Run a security audit

To check our app for vulnerabilities, run an *npm audit*. For help, check the [documentation](https://docs.npmjs.com/cli/v6/commands/npm-audit).

```
# Scan the project for vulnerabilities and just show the details, without fixing anything:
npm audit

# Scan the project for vulnerabilities and automatically install any compatible updates
npm audit fix
```

**Vulnerabilities found (Specifikation)**

11 vulnerabilities found in original repo where 3 are moderate and 8 high.

Explanation of vulnerabilities:

**ReDoS** - Regular Expression Denial of Service. Can in an attack or even by accident by a developer make an application become slow, unresponsive or even crash by consuming lots of system resources like CPU time or memory.[^1] 

**Inefficient Regular Expression Complexity Vulnerability** - Meaning that the use of regular expressions is unoptimized and leads to inefficiency in the system. Doesn't necessarily lead to a ReDoS, but can slow the application down.[^2]

**Prototype pollution** - is a vulnerability making it possible for a attacker to add properties to global object prototypes, which can harm systems or give an attacker unauthorized access.[^3]

- debug <=2.6.8 (**high**), ReDoS and inefficient Regular Expression Complexity vulnerability.
  - Vulnerable to ReDoS when untrusted user input is passed into the 'o' formatter.
  - Manipulation of the argument str in function useColors in the file src/node.js leads to inefficient regular expression complexity.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v2.2.0 to v2.6.9.

- express  2.5.8 - 4.15.4 || 5.0.0-alpha.1 - 5.0.0-alpha.5 (**high**), depends on vulnerable versions of debug, finalhandler, fresh, qs, send and serve-static.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v4.14.0 to v4.18.2.

- finalhandler <=1.0.5 (**high**), depends on vulnerable versions of debug.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v0.5.0 to v1.2.0.

- fresh <0.5.2 (**high**), ReDoS.
  - Vulnerable to ReDoS when parsing specially crafted user input.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v0.3.0 to v0.5.2.

- mime <1.4.1 (**moderate**), ReDoS.
  - Vulnerable to ReDoS when a mime lookup is performed on untrusted user input.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v1.3.4 to v1.6.0.

- ms <2.0.0 (**moderate**), Inefficient Regular Expression Complexity vulnerability.
  - Manipulation of the argument str in function parse in file index.js leads to inefficient regular expression complexity. The attack may be initiated remotely.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v0.7.1 to v2.0.0 and removed 'node_modules/serve-static/node_modules/ms' v0.7.2.

- node-fetch <2.6.7 (**high**), vulnerable to Exposure of Sensitive Information to an Unauthorized Actor.
  - **Fixed** by manually setting node-fetch to ^v2.7.0 in package.json.

- qs <=6.2.3 (**high**), Prototype Pollution and Prototype Pollution Protection Bypass.
  - qs before 6.10.3 allows attackers to cause a Node process hang because an __ proto__ key can be used.
  - The qs.parse function fails to properly prevent an object's prototype to be altered when parsing arbitrary input.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v6.2.0 to v6.11.0.

- semver 6.0.0 - 6.3.0 || 7.0.0 - 7.5.1 (**moderate**), ReDoS.
  - Vulnerable to ReDoS (ReDoS) via the function new Range, when untrusted user data is provided as a range.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v7.5.1 to v7.5.4 and v6.3.0 to v6.3.1 (node_modules/make-dir/node_modules/semver).

- send <=0.15.6 (**high**), depends on vulnerable of debug, fresh, mime and ms.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v0.14.1 to v0.18.0 and removed 'node_modules/serve-static/node_modules/send' v0.14.2.

- serve-static 1.1.0 - 1.12.5 (**high**), depends on vulnerable version of send.
  - **Fixed** automatically with *npm audit fix*, updating affected version from v1.11.2 to v1.15.0.

Running *npm audit fix* after changing package.json manually added 7 packages, removed 20 packages, changed 24 packages.

[^1]: https://www.regular-expressions.info/redos.html, last visited 2023-08-30.

[^2]: https://www.martellosecurity.com/kb/mitre/cwe/1333/, last visited 2023-08-30.

[^3]: https://portswigger.net/web-security/prototype-pollution, last visited 2023-08-30.


### Frontend

#### Start app

```
# To run the app on *http://localhost:9000/*
# Stand in the folder /frontend
python3 -m http.server 9000
```

## Choice of framework

For this project we opted to use the [Vue](https://vuejs.org/) framework for the frontend development of our app. This decision primarily stems from Vue's reputation for its user-friendly and intuitive nature, setting it apart from the potentially steeper learning curves associated with React and Angular. Vue seems furthermore the better choice for a simple application like ours. [^4]
Another advantage of Vue is that it has excellent documentation and learning resources. Compared to Svelte, another JavaScript framework we considered because of it beginner-friendly features, Vue has a wider and more robust community, which might be advantageous when we run into difficulties during development. [^5]

While selecting a JavaScript framework, we documented the advantages and disadvantages of each option, considering their relevance to our project and our level of experience. This information can be found in this [Google document](https://docs.google.com/document/d/1Iu-NJp805nbHyn00gttPkZc4HA0VUaw7iiD8hViXYVc/edit?pli=1#heading=h.7b137ldgxec0). For a more comprehensive understanding of our selection process, we encourage you to take a look at it.

[^4]: *Vue vs React vs... Svelte?!*: https://medium.com/@faulknerproject/vue-vs-react-vs-svelte-5f93d70d2618, last visited 2023-08-30.

[^5]: *React vs Vue vs Angular vs Svelte*: https://dev.to/hb/react-vs-vue-vs-angular-vs-svelte-1fdm, last visited 2023-08-30.

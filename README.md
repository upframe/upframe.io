[![Build Status](https://travis-ci.com/upframe/upframe.io.svg?branch=staging)](https://travis-ci.com/upframe/upframe.io)

# 🦄 Upframe

Our mission at Upframe involves bringing students and mentors together in a whole new way. We want to revolutionize the way an entrepreneurial individual can contact more experienced peers and unlock the full potential of mentorship. For this reason we decided to develop [**Upframe**](https://upframe.io).

# Setup

To setup the project locally run

```sh
git clone https://github.com/upframe/upframe.io
cd upframe.io
npm install
```

You will also need to set up the [API](https://github.com/upframe/graphapi) locally.

Create a `.env` file in the project's root directory with the content

```sh
REACT_APP_GRAPHAPI=http://localhost:5000
SKIP_PREFLIGHT_CHECK=true
EXTEND_ESLINT=true
```

to connect the frontend to your locally running API.

You can now start the frontend by running

```sh
npm start
```

# Code Structure

Inside the source folder there are three folders. The first folder, components, consists of all the individual components we use throughout the app. We try to keep our code as DRY as possible so these should be easily recyclable. The second folder, screens, is a collection of all the possible views the user has throughout the app. Since this is a single page application they are the closest thing to "different pages". Finally, the utils folder, consists of code that can be abstracted as independent libraries.

We try to stay in line with most of these rules: [https://github.com/airbnb/javascript/tree/master/react#naming](https://github.com/airbnb/javascript/tree/master/react#naming)

# Issues

Signaling issues is important for us developers to know what to fix. Here is a brief explanation on what to do when adding issues here.

- Short and concise title, use information regarding where the issue is located. Example: "Navbar: distorted picture when logged in".

- A detailed explanation of what the issue is. It's important to mention as much context as possible. It's also helpful to make sure you can replicate it. Here are some guidelines: browser version, if tried with a clear cache, when it happened, what was supposed to happen, what happened instead.

- If possible, a picture with the issue.

- Label the issue accordingly. All the labels have a small explanation of what they mean.

# License

[GPL © Upframe](../master/LICENSE)

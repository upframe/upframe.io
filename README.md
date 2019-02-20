[![Build Status](https://travis-ci.org/upframe/connect.svg?branch=master)](https://travis-ci.org/upframe/connect)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/5b6e96c455814101aa74c017ee1b173f)](https://www.codacy.com/app/Upframe/connect?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=upframe/connect&amp;utm_campaign=Badge_Grade)

# 🦄 Connect

Our mission at Upframe involves bringing students and mentors together in a whole new way. We want to revolutionize the way an entrepreneurial individual can contact more experienced peers and unlock the full potential of mentorship. For this reason we decided to develop **Connect**.

# Installation

Quick and easy install thanks to Yarn

```
git clone https://github.com/upframe/connect.git
cd connect
yarn install
```

After this you have all the front end dependencies ready to rock. Now it's time for the backend. Go to our backend repository and learn how to get it up and running then come back. If you already have a backend instance running you can now set the following environment variables (no " or ' needed):

REACT_APP_APIHOST - 127.0.0.1
REACT_APP_APIPORT - 80
REACT_APP_APISCHEMA - http

We use this to make sure our production deployment uses different settings but we can still try everything out locally. We are now ready to run! Fingers crossed and:

```
yarn start
```

Your default browser will automatically open a running version of Connect.

# Running

```
yarn start
```

# Code Structure

Inside the source folder there are three folders. The first folder, components, consists of all the individual components we use throughout the app. We try to keep our code as DRY as possible so these should be easily recyclable. The second folder, screens, is a collection of all the possible views the user has throughout the app. Since this is a single page application they are the closest thing to "different pages". Finally, the utils folder, consists of code that can be abstracted as independent libraries.

We try to stay in line with most of these rules: [https://github.com/airbnb/javascript/tree/master/react#naming](https://github.com/airbnb/javascript/tree/master/react#naming)
  
# License

[GPL © Upframe](../master/LICENSE)

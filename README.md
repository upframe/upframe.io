[![Build Status](https://travis-ci.com/ulissesferreira/connect.svg?token=xmikXYDzu8Ho8PZicgqF&branch=master)](https://travis-ci.com/ulissesferreira/connect)

# 🦄 Connect

Our mission at Upframe involves bringing students and mentors together in a whole new way. We want to revolutionize the way an entrepreneurial individual can contact more experienced peers and unlock the full potential of mentorship. For this reason we decided to develop **Connect**.

# Installation

Quick and easy install thanks to Yarn

```
git clone https://github.com/upframe/connect.git
cd connect
yarn install
```

# Running

```
yarn start
```

# Code Structure

Inside the source folder there are three folders. The first folder, components, consists of all the individual components we use throughout the app. We try to keep our code as DRY as possible so these should be easily recyclable. The second folder, screens, is a collection of all the possible views the user has throughout the app. Since this is a single page application they are the closest thing to "different pages". Finally, the utils folder, consists of code that can be abstracted as independent libraries.

We try to stay in line with most of these rules: https://github.com/airbnb/javascript/tree/master/react#naming

# License

[GPL © Upframe](../master/LICENSE)

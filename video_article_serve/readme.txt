Video and Article API/RSS for Code-Foo 2017:

This particular application runs via javascript and a node server on the backend. A package.json has been included for necessary node modules. Once your node server is started and your basic MySQL database has been started (see create table.sql in database folder) going to 127.0.0.1:5000 will bring you to the front page of the app.

The app has two primary functions:

1. Retrieve video or article content from IGN's API and write this data to the MySQL database. This is done via filling out the form and pressing submit. Data will be written to the appropriate table (either article or video).

2. Update RSS file with all the latest articles and videos that have been written to the database. This will prompt any aggregator with the content page (http://127.0.0.1:5000/content) listed to pull new URL's. I tested this via the chrome Feeder extension.
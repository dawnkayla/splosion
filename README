### Deploy:
- The app was written in such a way that it is able to be statically hosted here on github. Goto [https://grobot.github.io/splosion](https://grobot.github.io/splosion) and the app will work.
- If you want, you can host it statically on your own servers or on S3. Keep all the files in the repo where they are and it will work.

### Further Development:
- The majority of what is going on here is in two files:
  1) [`js/index.js`](https://github.com/grobot/splosion/blob/master/js/index.js)
  2) [`js/details.js`](https://github.com/grobot/splosion/blob/master/js/details.js)

- `index` queries `http://stocksplosion.apsis.io/api/company` and lists all available companies
- `details` queries `http://stocksplosion.apsis.io/api/company/LABEL` and charts the past 30 days prices and runs analysis. The logic for the analysis lies in the `analyzeData` function.

### Testing:
- The logic in this app is very simple. Most of the code is there to query the API and then display. The one function that could be tested would be `analyzeData` in the `js/details.js` file. It would be nice to fine tune that function more to give better results.

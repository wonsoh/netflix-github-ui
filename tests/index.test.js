const moment = require("moment");
const lib = require("./lib");

describe("Running end-to-end tests", () => {
  let puppet;

  beforeAll(async () => {});

  afterAll(async () => {});

  beforeEach(async () => {
    puppet = await lib.preparePuppeteer();
  });
  afterEach(async () => {
    await puppet.close();
  });

  it("should run basic user flow", async () => {
    const url = lib.getURL(3000);
    const page = await puppet.newPage();
    console.log("Going to ", url);
    await page.goto(url);
    // const searchBar = await page.$();
    await page.type("#search-bar", "netflix");
    await lib.sleep(1000);
    console.log("Submitting enter button");
    await page.keyboard.press("Enter");
    await page.waitForNavigation();
    // waiting for spinner to be gone
    await page.waitForSelector(".ant-spin-blur", {
      hidden: true
    });
    await page.waitForSelector("#repository-table th.ant-table-cell");
    const repoColumns = await page.$$("#repository-table th.ant-table-cell");
    console.log("Sorting by stargazers count");
    const stargazer = 2;
    const forks = 3;
    await lib.sleep(1000);
    await repoColumns[stargazer].click();
    const stargazerCounts = await page.$$eval("#repository-table td.ant-table-column-sort", (counts) => {
      return counts.map(v => Number(v.innerText));
    });
    let isSortedDescending = stargazerCounts.
      slice(1).
      every((item, i) => stargazerCounts[i] >= item);
    expect(isSortedDescending).toBeTruthy();
    await lib.sleep(3000);
    console.log("Sorting by forks count");
    await lib.sleep(1000);
    await repoColumns[forks].click();
    const forksCounts = await page.$$eval("#repository-table td.ant-table-column-sort", (counts) => {
      return counts.map(v => Number(v.innerText));
    });
    isSortedDescending = forksCounts.
      slice(1).
      every((item, i) => forksCounts[i] >= item);
    expect(isSortedDescending).toBeTruthy();
    
    await lib.sleep(5000);
    let repoLinks = await page.$$("#repository-table a.repo-link");
    console.log("Clicking on the first repository link");
    await repoLinks[0].click();
    await page.waitForNavigation();
    // waiting for spinner to be gone
    await page.waitForSelector(".ant-spin-blur", {
      hidden: true
    });
    let commits = await page.$$("#commits-table tr.ant-table-row");
    console.log("Verifying there are at least one commit existent");
    expect(commits.length).toBeGreaterThanOrEqual(1);
    await lib.sleep(3000);
    console.log("Verifying the commits are sorted by recents first");
    const commitTimeStamps = await page.$$eval("#commits-table td.ant-table-cell", (ts) => {
      return ts.
        filter((_, index) => (index % 5 === 1)). // only get timestamp cells
        map(v => new Date(v.innerText).valueOf());
    });
    // recent first means descending
    isSortedDescending = commitTimeStamps.
      slice(1).
      every((item, i) => commitTimeStamps[i] >= item);
    expect(isSortedDescending).toBeTruthy();

    console.log("Going back to previous page");
    await page.goBack();
    await page.waitForSelector(".ant-spin-blur", {
      hidden: true
    });
    await page.waitForSelector("#repository-table th.ant-table-cell");
    await lib.sleep(3000);

    repoLinks = await page.$$("#repository-table a.repo-link");
    console.log("Clicking on the second repository link");
    await repoLinks[2].click();
    await page.waitForNavigation();
    // waiting for spinner to be gone
    await page.waitForSelector(".ant-spin-blur", {
      hidden: true
    });
    commits = await page.$$("#commits-table tr.ant-table-row");
    console.log("Verifying there are at least one commit existent");
    expect(commits.length).toBeGreaterThanOrEqual(1);
    await lib.sleep(3000);

    console.log("Directly going to commits page of facebook/react");
    await page.goto(`${url}/commits/Facebook/react`);
    await lib.sleep(3000);
    await page.waitForSelector(".ant-spin-blur", {
      hidden: true
    });
    commits = await page.$$("#commits-table tr.ant-table-row");
    console.log("Verifying there are at least one commit existent");
    expect(commits.length).toBeGreaterThanOrEqual(1);
    await lib.sleep(3000);
  });
});
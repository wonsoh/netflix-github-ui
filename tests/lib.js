const puppeteer = require("puppeteer");

async function preparePuppeteer() {
  return puppeteer.launch({
    headless: !process.env.PUPPETEER_VISUAL,
  });
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

function getURL(port) {
  return `http://localhost:${port}`;
}

module.exports = {
  preparePuppeteer,
  sleep,
  getURL,
};
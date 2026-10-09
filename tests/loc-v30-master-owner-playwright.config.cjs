const {defineConfig}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'.',
  testMatch:'loc-v30-master-owner-browser.spec.cjs',
  timeout:30000,
  expect:{timeout:7000},
  use:{browserName:'chromium',headless:true,viewport:{width:390,height:844},trace:'retain-on-failure'},
  reporter:'line',
  workers:1
});

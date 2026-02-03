
const urls = [
  'https://api.expo.dev/v2/versions',
  'https://exp.host/--/api/v2/versions',
  'https://google.com'
];

async function testUrl(url) {
  console.log(`Testing: ${url}`);
  try {
    const start = Date.now();
    const response = await fetch(url);
    const duration = Date.now() - start;
    console.log(`Success! Status: ${response.status}, Time: ${duration}ms`);
  } catch (error) {
    console.error(`Failed! Error:`, error);
    if (error.cause) {
      console.error('Cause:', error.cause);
    }
  }
  console.log('---');
}

async function run() {
  console.log('Node Version:', process.version);
  console.log('DNS Order:', process.env.NODE_OPTIONS || 'Not Set');
  
  for (const url of urls) {
    await testUrl(url);
  }
}

run();

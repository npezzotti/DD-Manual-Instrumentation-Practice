const tracer = require('dd-trace').init({
  env: "manual-instrumentation"
});

function handle () {
  // some code
  console.log("hi")
}

const handleWithTrace = tracer.wrap('web.request', handle)

handle();

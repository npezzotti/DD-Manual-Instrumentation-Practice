const tracer = require('dd-trace').init({
  env: "manual-instrumentation-practice",
  service: "request",
  analytics: true
});

const request = () => {
  // tracer.trace() takes an operaton name, trace options, and an optional callback
  tracer.trace('request', { type: "web", resource: "web request"}, (span, callback) => {
    console.log("hello from request!");
    span.addTags({
      functionName: "request",
      info: "contains a callback which prolongs completion of span to execution of other functions"
    })
    console.log("Picking up a baggage item with span.setBaggageItem! This function takes two comma-separated strings as arguments- the key and the value.")
    span.setBaggageItem("functionName", "request")
    console.log("Look at the baggage item under _baggageItems! \n", span.context());
    innerFunction();
    callback(console.log("goodbye " + span.getBaggageItem("functionName")));
  });
};

const innerFunction = () => {
  // the operation name is set with span.setOperationName() instead of as an argument for trace.trace()
  tracer.trace('innerFunction', { type: "function", resource: "function" }, (span, callback) => {
    // span.setOperationName("innerFunction");
    console.log("hello from innFunction()!");
    console.log("adding two tags with span.addTags()...")
    span.addTags({
      functionName: "innerFunction",
      info: "this has a span.finish() function applied before the next function"
    })
    // you can force a span to end with span.finish()
    span.finish()
    anotherInnerFunction();
    callback(console.log("ready..."))
  });
};

const anotherInnerFunction = () => {
  tracer.trace('anotherInnerFunction', { type: "db", service: "database", resource: "db query" }, span => {
    console.log("hello from anotherInnerFunction()!");
    // add a tag
    span.setTag("operation", "this is a mock database resource");
    // span.tracer() returns the trace object that generated the span
    console.log(span.tracer());
    console.log("Let's see the current span context... \n", tracer.scope());
  });
};

request();

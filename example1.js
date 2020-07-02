const tracer = require('dd-trace').init({
  env: "manual-instrumentation-practice",
  service: "manual-instrumentation-practice"
});

const request = () => {
  tracer.trace('custom.trace', (span, callback) => {
    span.setOperationName("request");
    console.log("hello");
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
  tracer.trace('inner.span.1', (span, callback) => {
    span.setOperationName("innerFunction");
    console.log("hello again");
    span.addTags({
      functionName: "innerFunction",
      info: "this has a span.finish() function applied before the next function"
    })
    span.finish()
    anotherInnerFunction();
    callback(console.log("ready..."))
  });
};

const anotherInnerFunction = () => {
  tracer.trace('inner.span.2', span => {
    span.setOperationName("anotherInnerFunction");
    console.log("hello a third time");
    span.addTags({
      functionName: "anotherInnerFunction"
    })
  });
};

const anotherRequest = () => {
  tracer.trace('another.custom.trace', (span, callback) => {
    span.setOperationName("anotherRequest");
    console.log("hello");
    innerFunction();
    callback(console.log("goodbye"));
  });
};

request();
anotherRequest();




Plan

1 - Implement e2e tests that make crud requests 
2 - Implement using TDD those endpoints
3 - Let's keep it simple and use express and small stuff because the API is little
4 - Think about how to persist the devices
    * actual DB might be too much for the beginning
5 - Let's think about architecture (controllers, use-cases, AggregateRoot, no primitive types) DDD?
6 - Setup docker 
7 - Setup CI


Design decisions log:

1 - No backend framework is going to be used as it is excessive for such a small API
2 - I wouldn't use a relational database because we only have one entity so there will be no joins which is in my opinion one of the biggest pluses of having a relational DB. At the same time there was no mention of concurrent requests so could I use just a json file to store the devices or will this too hard to deal with.
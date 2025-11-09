


Plan

6 - Setup docker
7 - Setup CI
8 - Setup rate limiting
9 - Setup authentication with API keys
10 - Check if we have the necessary logging
13 - Openapi documentation
14 - Is it possible to export a postman collection
15 - Add pagination and filtering on the get
16 - We could have ObjectMothers in the future with faker or something in order to have more variety when creating the test objects and a better experience when creating those test objects
17 - Remove the constant id's for the container services which could be in a single file
18 - Could have dependency injection for each environment (prod, dev, stg)
19 - Could improve the env variable configuration system by having a centralized getConfig with a defined type and configurations per environment
20 - Remove indexing on the tests '[0]' wouldn't be necessary if we had object mothers
21 - Make sure to review the status codes
22 - Add try catches in the service with logging and also logging on request received
23 - Could improve the responses for errors
24 - Thinking about wether or not we should have integration tests for the database integration
25 - Missing unit tests on domain validation or at least integration
26 - Make sure every package.json command works

• Fetch a single device.

Design decisions log:

1 - No backend framework is going to be used as it is excessive for such a small API
2 - I wouldn't use a relational database because we only have one entity so there will be no joins which is in my opinion one of the biggest pluses of having a relational DB. Going to use mongodb because it is very used in the market so it has support for the future
3 - Since the API is very simple this application will only have e2e tests (they are the closest thing to the actual usaage of this API in production and will cover most of the code). The tests are huge so probably I would make some integration or unit on specific domain decisions just to not overload the e2e test file no more.
4 - Using a hybrid approach between OOP and functional programming to better apply DDD
5 - There is no need for an aggregate root since we only have one entity but we should have entity types for each primitive field and their validations should be inside the creation of those fields. The manipulation of devices will be managed by the services

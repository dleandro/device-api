
### Future steps

* Setup CI
* Setup rate limiting
* Setup authentication with API keys
* Add pagination on the get endpoint response
* Add ObjectMothers in the future with faker or something in order to have more variety when creating the test objects and a better dev experience when creating those test objects
* Remove the constant id's for the container services, they could be in a single file as container-ids.ts
* Could have dependency injection for each environment (prod, dev, stg)
* Could improve the env variable configuration system by having a centralized getConfig with a defined type and configurations per environment
* Remove magic indexing on the tests '[0]' wouldn't be as necessary if we had object mothers
* Should improve the responses for errors
* Missing integration tests on domain validations
* Domain errors should be thrown from the domain only that could be changed
* Had some transpilation issues so at the moment only typescript is used to run the application, in the future those issues should be looked into

update documentation on the readme and clean up the env files

Design decisions log:

1 - No backend framework is going to be used as it is excessive for such a small API
2 - I wouldn't use a relational database because we only have one entity so there will be no joins which is in my opinion one of the biggest pluses of having a relational DB. Going to use mongodb because it is very used in the market so it has support for the future
3 - Since the API is very simple this application will only have e2e tests (they are the closest thing to the actual usaage of this API in production and will cover most of the code). The tests are huge so probably I would make some integration or unit on specific domain decisions just to not overload the e2e test file no more.
4 - Using a hybrid approach between OOP and functional programming to better apply DDD
5 - There is no need for an aggregate root since we only have one entity but we should have entity types for each primitive field and their validations should be inside the creation of those fields. The manipulation of devices will be managed by the services
6 - There is a json openapi document with the contracts of the endpoints and it is in JSON because sometimes I struggle with importing the yaml files in Postman. With this file you can import and generate a collection in postman to try the API out.

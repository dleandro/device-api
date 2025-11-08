


Plan

4 - Think about how to persist the devices
    * actual DB might be too much for the beginning
    * think about how to setup the env variables for the DB specially
5 - Let's think about architecture (controllers, use-cases, AggregateRoot, no primitive types) DDD?
6 - Setup docker
7 - Setup CI
8 - Setup rate limiting
9 - Setup authentication with API keys
10 - Check if we have the necessary logging
11 - Make sure we have controlled errors and use the status code lib
13 - Openapi documentation
14 - Is it possible to export a postman collection

• Create a new device.
• Fully and/or par:ally update an exis:ng device.
• Fetch a single device.
• Fetch all devices.
• Fetch devices by brand.
• Fetch devices by state.
• Delete a single device.


Design decisions log:

1 - No backend framework is going to be used as it is excessive for such a small API
2 - I wouldn't use a relational database because we only have one entity so there will be no joins which is in my opinion one of the biggest pluses of having a relational DB.
3 - Since the API is very simple this application will only have e2e tests (they are the closest thing to the actual usaage of this API in production and will cover most of the code)



FIX LOGGING AND COMMIT

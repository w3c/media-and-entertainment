Web Development Experience on Embedded Devices
==============================================

Background
----------

Developers typically run an HTTP server on their computer and test their web application using localhost. For testing on TV there needs to be a simple and standardized approach to loading a locally running web application. Enabling developer mode on a TV should allow a developer to “cast” a development server URL to the TV. It should be as simple as Chromecast has become to video playback. And TV’s need to support remote web inspector for debugging.

Currently, each TV manufacturer has a different approach to loading a web application on a TV. Most require creating unique developer accounts, deploying an application to a hosted endpoint, or packaging the app to deploy it. Each is tedious and provides a slow developer feedback loop.

Problem statement
-----------------

What are the different ways to load a web application on an embedded device? How do we create a unified solution which improves developer experience.

Potential topics
----------------

* Progressive Web Apps
Currently a W3C standard for allowing advanced functionality for mobile apps which could be leveraged by TV manufacturers

* Web App Store
Ability for Web App developers to package their TV apps in a standard way and allow multiple embedded devices to download the apps.

* Video Playback Layer Support
Some devices always playback video on the lowest layer making it very diffucult to create experiences with an embedded video on top of a UI.

* Webdriver for Testing
Making it easier to remote control web browsers on embedded devices for automated testing

* Eliminating need for Emulators

Stakeholders
------------

* TV Manufacterers

* TV APP Developers

* Browser vendors

Contact
-------

Interested parties are encouraged to get in touch with the group, either through [GitHub issues](https://github.com/w3c/media-and-entertainment/issues) or the group's [public mailing-list](mailto:public-web-and-tv@w3.org). You may also contact the group's chairs or W3C team:

* [Chris Needham](mailto:chris.needham@bbc.co.uk) - Chair
* [Chris Lorenzo](mailto:pal@sandflow.com) - Chair
* [Tatsuya Igarashi](mailto:Tatsuya.Igarashi@sony.com) - Chair
* [Kazuyuki Ashimura](mailto:ashimura@w3.org) - W3C team
* [Francois Daoust](mailto:fd@w3.org) - W3C team

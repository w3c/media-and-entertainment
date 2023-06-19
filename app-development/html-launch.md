Launching Web Applications on consumer products
================================================

The term "consumer product" is used here with the same meaning as in the [Web Media API](https://w3c.github.io/webmediaapi/#introduction) document and encompasses TV sets, game machines and set-top boxes.

Summary
----------
Web app developers need a simple and unified solution to easily run their web applications on consumer products. Ideally this should be:

* Enable Developer Mode on Consumer Product
* Send URL to consumer product to load


Background
----------

Developers typically run an HTTP server on their computer and test their web application using localhost. Each TV manufacturer has a different approach to loading a web application on a TV. Most require creating unique developer accounts, deploying an application to a hosted endpoint, or packaging the app to deploy it. This creates a slow developer feedback loop and inhibits development of Web Apps for consumer products.

Current Protocols
-----------------

[DIAL](http://www.dial-multiscreen.org/) is a simple protocol that second-screen devices can use to discover and launch apps on first-screen devices

[Open Screen](https://w3c.github.io/openscreenprotocol/) 
The Open Screen Protocol is a suite of network protocols that allow user agents to implement the Presentation API and the Remote Playback API in an interoperable fashion.

[Cast Protocol](https://developers.google.com/cast/docs/get-started)
The Cast SDK allows a user to select streaming audio-visual content using a Sender, and play it on (or cast it to) another device known as the Receiver, while controlling playback using the Sender.

Security Concerns
-----------------

Launching a browser URL on TV device would require

* User to be on network with TV
* TV to be in developer mode
* Browser is a sandbox

Additional Background
---------------------

### Samsung / Tizen App Development
* https://docs.tizen.org/application/web/
* https://docs.tizen.org/application/web/tutorials/process/app-dev-process/
* https://developer.samsung.com/smarttv/develop/guides/fundamentals/configuring-tv-applications.html

Requires packaging the app and digitally signing it with certificate. Tizen offers a hosted solution which requires approval.
Launching app on development TV requires proprietary solution [SDB](https://developer.tizen.org/development/tizen-studio/web-tools/running-and-testing-your-app/sdb)


### LG TV
* https://webostv.developer.lge.com/develop/getting-started/build-your-first-web-app

Uses IPK packaging format to bundle web app for TV
Hosted solution still requires an installed package which refreshes to hosted URL
Launching app on development TV requires proprietary solution [ARES](https://webostv.developer.lge.com/develop/tools/cli-dev-guide)

### Roku
* https://developer.roku.com/docs/developer-program/getting-started/roku-dev-prog.md

Roku only supports BrightScript on their devices.

### RDK
* https://developer.rdkcentral.com/firebolt/documentation/build-apps/web-apps/startup-guide/?v=0.6

RDK devices have unique ways per device for loading Web Applications. Uses WPE browser.

Contact
-------

Interested parties are encouraged to get in touch with the group, either through [GitHub issues](https://github.com/w3c/media-and-entertainment/issues) or the group's [public mailing-list](mailto:public-web-and-tv@w3.org). You may also contact the group's chairs or W3C team:

* [Chris Needham](mailto:chris.needham@bbc.co.uk) - Chair
* [Chris Lorenzo](mailto:Christopher_Lorenzo@Comcast.com) - Chair
* [Tatsuya Igarashi](mailto:Tatsuya.Igarashi@sony.com) - Chair
* [Kazuyuki Ashimura](mailto:ashimura@w3.org) - W3C team
* [Francois Daoust](mailto:fd@w3.org) - W3C team

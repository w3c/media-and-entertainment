Developing web applications on consumer products
================================================

This is a draft charter for a possible Application Development for Consumer Products task force within the Media & Entertainment Interest Group.

The term "consumer product" is used here with the same meaning as in the [Web Media API](https://w3c.github.io/webmediaapi/#introduction) document and encompasses TV sets, game machines and set-top boxes.


Background
----------

The development and testing of web applications across consumer products remains challenging. We have identified two main areas to focus on, as described below.

### The web development experience for consumer products

Developers typically run an HTTP server on their computer and test their web application using localhost. Each TV manufacturer has a different approach to loading a web application on a TV. Most require creating unique developer accounts, deploying an application to a hosted endpoint, or packaging the app to deploy it. This creates a slow developer feedback loop.

Currently, each TV manufacturer has a different approach to loading a web application on a TV. Most require creating unique developer accounts, deploying an application to a hosted endpoint, or packaging the app to deploy it. Each is tedious and provides a slow developer feedback loop.

### Performance of web applications on consumer products

Building a performant and polished user interface (UI) for consumer products using common web technologies turns out to be a hard task. Consumer products are geared towards high quality media playback (e.g. support for smooth playback 4K content in HDR) but generic computing capabilities (CPU, memory) remain constrained when compared to other types of general devices that run web applications (desktops, laptops, smartphones).

Yet users expect the UI to be as polished and smooth as media playback, with gradients, drop shadows, and animations. From an application perspective, the more complicated the UI, the less time there is to run API and business logic work on the main thread. In order to achieve 60 frames per second (FPS), there is only 16ms of processing time per frame. On constrained devices, even without running any business logic, this may be enough to experience recurring flickering of the UI on the screen, also known as UI jank, if the application uses a regular HTML approach that uses CSS for styling and animations. Adding business logic, API calls, and lazy loading of data further compromise UI performance.

The browser contains other rendering and computing solutions which are near native speeds and can give developers more control and flexibility over device limits and UI janks. For instance, frameworks that leverage WebAssembly for computing and canvas-based technologies such as WebGL and WebGPU for rendering, could be used to create an optimized web runtime for developing UIs targeted at TV sets and set-top boxes.


Mission
-------

The Application Development for Consumer Products task force is part of the Media & Entertainment Interest Group. The task force is reponsible for:

* Exploring practical issues that developers face in writing applications that target consumer products
* Exploring development workflows on consumer products and suggesting standardized approaches to loading a locally running web application on consumer products, enabling debugging tools and remote controlling of browsers through WebDriver.
* Assessing standardization needs and suggesting next steps for converging on a web runtime to package, distribute and efficiently run media applications on consumer products.
* Exploring mechanisms to measure performance of web UIs on consumer products.
* Documenting common UI patterns that impact performance and may create UI jank on consumer products.
* Documenting approaches that developers may consider to create optimized applications for consumer products: canvas-based rendering using WebGL or WebGPU, using WebAssembly for computing tasks and memory management, lazy loading of data and local storage, efficient integration of video playback within the UI, etc.
* Evaluating merits and drawbacks of the previous approaches, e.g. on meeting accessibility requirements.


Success criteria
----------------

The task force has succeeded if it can propose the following deliverables to the Interest Group:

* An analysis of development workflows to test web applications on consumer products and suggestions for creating developer-friendly testing and debugging environments on consumer products.
* An open-source toolkit to measure performance of web UIs on consumer products.
* An analysis of common UI patterns that negatively impact performance on consumer products.
* An analysis of approaches that can be used to avoid UI janks on consumer products.
* An analysis of possible standardisation needs for defining an efficient web runtime for consumer products.

The task force may decide to group analyses in one or more report.


Out of scope
------------

The following are out of scope for the task force:

* Creating a benchmark of existing consumer products.
* Recommending performance requirements for consumer products.
* The technical development of standards.


Stakeholders
------------

* TV application developers
* TV, set-top box, and media streaming device manufacturers
* Browser vendors and browser integrators


Contact
-------

Interested parties are encouraged to get in touch with the group, either through [GitHub issues](https://github.com/w3c/media-and-entertainment/issues) or the group's [public mailing-list](mailto:public-web-and-tv@w3.org). You may also contact the group's chairs or W3C team:

* [Chris Needham](mailto:chris.needham@bbc.co.uk) - Chair
* [Chris Lorenzo](mailto:Christopher_Lorenzo@Comcast.com) - Chair
* [Tatsuya Igarashi](mailto:Tatsuya.Igarashi@sony.com) - Chair
* [Kazuyuki Ashimura](mailto:ashimura@w3.org) - W3C team
* [Francois Daoust](mailto:fd@w3.org) - W3C team

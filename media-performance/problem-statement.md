Web Performance on Embedded Devices
==============================================

Background
----------

Building a performant and polished UI for a TV application using HTML is extremely difficult. While devices have steadily increased their processing power, the CPU is heavily taxed by JavaScript and HTML rendering. The performance of HTML rendering is no longer enough to meet users expectations for a polished interface with gradients, drop shadows, animations and performance of a native app. The more complicated the UI the less time there is to use the main thread to do API and business logic work. In order to achieve 60fps, there is 16ms of processing time per frame and the browser will use most of that to do housekeeping work. Even without any business logic, the UI is regularly janky and with business logic and API calls and lazy loading data, the performance of the UI is compromised.

However, the browser contains other rendering solutions which are near native speeds: WebGL and WebGPU. As TV manufacturers invest in making web development simpler, new frameworks can be created to use the browser as an ideal solution for building TV applications.


Potential topics
----------------

* Benchmarking
Toolkit to measure performance of TV 

* WebGL + WebGPU
Explore using different rendering layers

* Web Assembly
Explore Web Assembly as a potential solution

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

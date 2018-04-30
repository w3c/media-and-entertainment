# Use cases and gap analysis: Media timed events and synchronisation in HTML5

This document page collects use cases and requirements for new or changed Web APIs for improved support for timed events related to A/V media on the Web, such as subtitles, captions, other web content, where synchronisation to a playing A/V media stream is needed.

## Use case: Synchronised event triggering

TODO: Add user-oriented use case description here.

DASH events may be conveyed via an EventStream fragment in the MPD (Media Presentation Description) document. Or, ISO BMFF files may contain arbitrary binary data in emsg boxes (known as 'in-band' events).

Use cases for emsg boxes include playing an audio file or displaying an image in sync with the A/V media where close synchronisation is needed.

Reference: M&E IG call 1 Feb 2018: [Minutes](https://www.w3.org/2018/02/01-me-minutes.html), [Slides](https://www.w3.org/2011/webtv/wiki/images/a/a5/DASH_Eventing_and_HTML5.pdf).

See also [this issue](https://github.com/w3c/webmediaguidelines/issues/64) against the Web Media API CG's Web Media Application Developer Guidelines 2017.
 
### Gap analysis

The DataCue API could be used to deliver in-band event data to Web applications, but this is not implemented in mainstream browser engines. It is included in the current (as of Feb 2018) [HTML5.3 draft](https://w3c.github.io/html/semantics-embedded-content.html#text-tracks-exposing-inband-metadata), but is not in [WHATWG HTML](https://html.spec.whatwg.org/multipage/media.html#timed-text-tracks). See discussion [here](https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/U06zrT2N-Xk), and notes on implementation status [here](https://lists.w3.org/Archives/Public/public-html/2016Apr/0005.html).

Neither [ISO BMFF Byte Stream Format](https://www.w3.org/2013/12/byte-stream-format-registry/isobmff-byte-stream-format.html) nor [Sourcing In-band Media Resource Tracks from Media Containers into HTML (Unofficial Draft)](https://dev.w3.org/html5/html-sourcing-inband-tracks/) describe handling of emsg boxes.

The timing guarantees provided in HTML5 regarding the triggering of TextTrackCue events may be not be enough to avoid [events being missed](https://lists.w3.org/Archives/Public/public-inbandtracks/2013Dec/0004.html).

## Use case: Synchronised rendering of web resources

TODO: Add a user-oriented description of the use case, e.g, frame-accurate rendering of web content alongside audio/video.

The MPEG [Working Draft on Carriage of Web Resources in ISOBMFF](https://mpeg.chiariglione.org/standards/mpeg-4/timed-text-and-other-visual-overlays-iso-base-media-file-format/wd-carriage-web), N16944, published at MPEG 119, Torino.

> This document specifies the use of ISO BMFF tools for the storage and delivery of web data. The specified storage is designed to enable enriching audio/video content, as well as audio-only content, with synchronized, animated, interactive web data, including overlays.

### Gap analysis

There is no API for surfacing Web content embedded in ISO BMFF containers into the browser (e.g., the `HTMLCue` proposal discussed at [TPAC 2015](https://www.w3.org/wiki/TPAC2015/HTMLcue)?)

TODO: add more detail on what's required...

Some questions / considerations:

* Are the web resources intended to be handed to a Web application for rendering, or direct rendering by the UA?
* How do we guarantee that resources are delivered to the browser sufficiently ahead of time?
* How does same-origin policy affect such resources?

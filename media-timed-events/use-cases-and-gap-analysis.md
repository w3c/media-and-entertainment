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

## Use case: Support for subtitle and caption formats other than WebVTT

Although WebVTT is [widely supported](https://caniuse.com/#feat=webvtt) by the mainstream browser engines, many content providers use other formats such as TTML, IMSC, or the US FCC-mandated 608 and 708 closed caption formats, to deliver subtitles and captions to web clients. These formats are not supported natively by mainstream browser engines, therefore must be parsed and rendered at the web application level.

Native rendering by the browser engine is preferable to application rendering, to synchronise the display of subtitles and captions, and apply user preferences at the UA level.

Reference: TPAC 2017 breakout session 8 Nov 2017: [Minutes](https://www.w3.org/2017/11/08-texttrack-minutes.html), TPAC 2016 breakout session 21 Sep 2016: [Minutes](https://www.w3.org/2016/09/21-texttrack-minutes.html)

### Gap analysis

A solution could be for cue parsing to be done at the application level, with cue data passed to the UA in some canonical format for rendering. This allows app developers to use their preferred cue format, while retaining the UA's ability to control the triggering and synchronisation of the cues.

There is currently no agreed model for applying user preferences to how cues are rendered. 

The `TextTrackCue` interface has no constructor, so the generic concept of a text track cue cannot be used and extended by scripts; only the `VTTCue` constructor is widely implemented.

The TextTracks in MSE are not implemented in mainstream browsers.

Both W3C HTML 5.3 draft and WHATWG HTML reference [Sourcing In-band Media Resource Tracks from Media Containers into HTML (Unofficial Draft)](https://dev.w3.org/html5/html-sourcing-inband-tracks/), which says:

> Browsers that can render text tracks in the TTML format should expose an as yet to be defined `TTMLCue`. Alternatively, browsers can also map the TTML features to `VTTCue` objects. Finally, browsers that cannot render TTML format data should expose them as `DataCue` objects.

The WHATWG reference is normative, and the HTML 5.3 reference is (more appropriately) informative.

`TTMLCue` never was defined and (as already mentioned) `DataCue` is not implemented.

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

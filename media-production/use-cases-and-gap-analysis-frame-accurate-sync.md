# Use Cases and Gap Analysis: Frame Accuracy for Media Production

This document collects use cases and requirements for new or changed Web APIs related to frame accuracy to improve support for media production.

## Functional Gaps

### The media timeline is not precise enough to identify individual frames

[HTML] does not expose any precise mechanism to assess the time, from a user's wall clock perspective, at which a particular media frame is going to be rendered. A web application may only infer this information by looking at the [media element]'s [currentTime] property to infer the frame being rendered and the time at which the user will see the next frame. This has several limitations:

* [currentTime] is represented as a double value, which does not allow it to identify individual frames due to rounding errors. This is a [known issue][html#109].
* [currentTime] is updated at a user-agent defined rate (typically the rate at which [time marches on] runs), and is kept stable while scripts are running. When a web application reads [currentTime], it cannot tell when this property was last updated, and thus cannot reliably assess whether this property still represents the frame currently being rendered.

In addition, [currentTime] only accepts a time value, and neither has the abiliy, nor is there an alternative API, to set its value to a frame number or [SMPTE Time Code].

### Seeking to next/previous frame

The [media element] does not provide a mechanism to seek by individual frames. This can be worked around by using the media's frame rate and the [media element]'s [currentTime] property to seek by a frame duration from the reported [currentTime] value, but the [currentTime] property does not guarantee frame level precision. In addition, the frame rate of the media may vary over time, may be rounded internally by the browser, and is not exposed.

### Indeterminate frame boundaries for segments in Media Source Extensions

When appending segments using [Media Source Extensions], the [timestampOffset] property does not provide enough precision to identify frame boundaries. This suffers the same limitation as [currentTime], where the value is represented as a double, which does not allow it to identify individual frames due to rounding errors.

### Association of a video frame with local wall clock

A [media element]'s clock is not required to follow any clock available via the [HTML] API. As such, there's no way to associate that clock with a local clock, preventing synchronization across media and other content.

### Synchronization with remote playback

For playback of remote content (e.g., via the [Remote Playback API] or [Picture-in-Picture]), whether the content will be able to be synchronized remains an open question. This [has been reported][media-and-entertainment#21] by the [Second Screen Community Group].

[HTML]: https://html.spec.whatwg.org/multipage/
[media element]: https://html.spec.whatwg.org/multipage/media.html#media-element
[currentTime]: https://html.spec.whatwg.org/multipage/media.html#dom-media-currenttime
[html#109]: https://github.com/whatwg/html/issues/609
[SMPTE Time Code]: https://www.smpte.org/
[Media Source Extensions]: https://www.w3.org/TR/media-source/
[time marches on]: https://html.spec.whatwg.org/multipage/media.html#time-marches-on
[timestampOffset]: https://www.w3.org/TR/media-source/#dom-sourcebuffer-timestampoffset
[Remote Playback API]: https://www.w3.org/TR/remote-playback/
[Picture-in-Picture]: https://w3c.github.io/picture-in-picture/
[media-and-entertainment#21]: https://github.com/w3c/media-and-entertainment/issues/21
[Second Screen Community Group]: https://www.w3.org/community/webscreens/

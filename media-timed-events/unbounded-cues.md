# Unbounded cues in WebVTT

## Introduction

This document describes technical use cases and requirements to inform design decisions when using unbounded (indefinite duration) cues in WebVTT.

Design decisions include considerations such as:

* WebVTT syntax for unbounded cues
* Processing model for updating unbounded cues
* Backwards compatibility with existing WebVTT parsers
* Uniquely identifying cues across multiple VTT files, e.g., when used in segmented media delivery

The scope includes WebVTT, delivered either as files or when carried in media containers.

There is no WebVTT syntax yet to indicate unbounded cues, and it's a hard problem if you consider backwards compatibility.

### Background discussion

Refer to the following discussion:

* WebVTT issue [#493](https://github.com/w3c/webvtt/pull/493)
* WebVTT issue [#496](https://github.com/w3c/webvtt/issues/496)
* Media & Entertainment Interest Group Media Timed Event Task Force call, [15 March 2021](https://www.w3.org/2021/03/15-me-minutes.html#t02)
* Media & Entertainment Interest Group Media Timed Event Task Force call, [19 April 2021](https://www.w3.org/2021/04/19-me-minutes.html#t01)
* Timed Text Working Group call, [29 April 2021](https://www.w3.org/2021/04/29-tt-minutes.html#t05)
* Timed Text Working Group call, [13 May 2021](https://www.w3.org/2021/05/13-tt-minutes.html#t04)
* Media & Entertainment Interest Group WebVTT Unbounded Cues call, [15 June 2021](https://www.w3.org/2021/06/15-me-minutes.html)
* Timed Text Working Group call, [24 June 2021](https://www.w3.org/2021/06/24-tt-minutes.html#t02)
* [WebVMT presentation at TPAC 2020](https://www.w3.org/2020/10/26-video-location-minutes.html)

## Stakeholders

* Content providers using WebVTT
* Content providers using WebVTT-derived formats such as WebVTT
* All major web browsers
* Web-based media players: Video.js, DASH.js, Shaka Player
* Parser libraries: vtt.js
* Native video players: VLC
* Cast devices: Chromecast
* Standards groups: W3C TTWG and MEIG, WHATWG, MPEG

# High-level use cases

## Use Case 1: Live chapterization
Any time where we want to mark a piece of the video as a particular chapter but because it's a live video, we don't know when the current chapter will end.

### Example: Updating a sports score.

Sports scores are basically a specific type of chapterization.

The score during a live sports event is "0-0" at the start and may change to increase the score at an unknown future time.
It isn't possible to know ahead of time for how long the initial "0-0" or any subsequent scores will last.
We'd want to be able to transition from a score of "0-0" to "1-0" etc as soon as the new score is known and the previous score should no longer be active.

Cue value can be either text for subtitles or a JSON object for metadata.

## Use Case 2 Live Captioning

A potential use-case for unbounded cues is in supporting live captions.
For VOD with pop-on captions, it's relatively easy to map things to cues as everything is known ahead of time and you can emit a cue at the end of a sentence.
For live captions, it's not as simple. While a person is speaking in a live scenario, it may not be known when the sentence is finishing and delaying sending the cue until a good stopping point will mean that the captions are delayed and cause a bad user experience.
Ideally, we'd want to send caption data on a regular basis to clients and have the client handle things as appropriate. This is one of the things that CEA-608/708 handle pretty well. Unfortunately, because it's encoded in video data it isn't ideal to send to clients, especially web-clients.

The following sub-uses cases are less use cases and more ways of delivering live captioning right now to the client, with the exclusion of TTML/IMSC.

### Use case 2a: Segmented WebVTT files

WebVTT can be segmented for HLS delivery. The HLS specification [extends WebVTT with a header](https://datatracker.ietf.org/doc/html/draft-pantos-hls-rfc8216bis-09#section-3.1.4) which maps segment PTS values to local time, meaning, each VTT segment could start at 00:00:00.000 and the PTS value would be incremented to align the timings. Though, most commonly, the VTT cue timings are relative to the beginning of the stream rather than the current segment.

### Use case 2c: WebVTT carried in fragmented MP4

### Use case 2b: CEA-608/708 captions

Some in-band text track formats (CEA-608/708) deliver cues with only a start time.
In these formats a cue ends when the next cue or empty edit is delivered. In WebKit,
these cues are given an end time of +Infinity when they are delivered.

This is an important use case not for 608/708 directly, but to ensure real-time
translation from that format to WebVTT can be done without text delay. Today paint-on
captions must be delayed until full lines are available, with the changes proposed
here they could be provided in real time.

## Use case 4: WebVMT

[WebVMT](https://w3c.github.io/sdw/proposals/geotagging/webvmt/) can record location
measurements (latitude and longitude) of a moving object at points in time,
synchronized to a video recording. Each location measurement is associated with a
point in time, but is represented in WebVMT as a cue with start time but unbounded
duration. A later location measurement replaces the earlier measurement.

Values such as distance and speed can be derived from a sequence of timed locations
with intermediate values calculated by interpolation. This approach was discussed
at [TPAC 2020](https://www.w3.org/2020/10/26-video-location-minutes.html) and has
been extended to support sensors which capture a sequence of timed values that can
be interpolated using either linear or step schemes for continuous values such as
speed, or no interpolation for discrete values such as a target count in a video
frame.

# Requirements

## Req. 1: Updating an existing cue

TODO: ...

## Req. 1a: Changing from unknown end time to known end time

TODO: ...

## Req. 1b: Changing from known end time to another known end time

TODO: ...

## Req. 1c: Updating a cue value without changing start or end time

TODO: ...

## Req. 2: Inserting a long duration cue in fragmented MP4

TODO: ...

## Req. 3: Updating a cue in a previous WebVTT file (e.g., segmented delivery)

TODO: ...

## Req. 4: Backwards compatibility with existing parsers

TODO: ...

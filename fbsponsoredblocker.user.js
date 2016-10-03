// ==UserScript==
// @name         Facebook Sponsored Blocker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Block Facebook news feed sponsored post
// @author       nilotpal
// @match        https://www.facebook.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

var streamSelector = 'div[id^="topnews_main_stream"]';
var storySelector = 'div[id^="hyperfeed_story_id"]';
var sponsoredSelectors = [
    'a[href^="https://www.facebook.com/about/ads"]',
    'a[href^="https://www.facebook.com/ads/about"]',
    'a[href^="/about/ads"]',
    'a[href^="/ads/about"]'
];

var mutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

function block(story) {
    if(!story) {
        return;
    }

    var sponsored = false;
    var i;
    for(i = 0; i < sponsoredSelectors.length; i++) {
        if(story.querySelectorAll(sponsoredSelectors[i]).length) {
            sponsored = true;
            break;
        }
    }

    if(sponsored) {
        story.remove();
    }
}

function process() {
    // Locate the stream every iteration to allow for FB SPA navigation which
    // replaces the stream element
    var stream = document.querySelector(streamSelector);
    if(!stream) {
        return;
    }

    var stories = stream.querySelectorAll(storySelector);
    if(!stories.length) {
        return;
    }

    var i;
    for(i = 0; i < stories.length; i++) {
        block(stories[i]);
    }
}

var observer = new mutationObserver(process);
observer.observe(document.querySelector('body'), {
    'childList': true,
    'subtree': true
});
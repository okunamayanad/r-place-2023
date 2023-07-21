// this code will be executed after page load
(function() {
  // ==UserScript==
  // @name         RPlace 2023
  // @namespace    https://okunamayanad.com/
  // @version      1.2
  // @description  Discord: @okunamayand, Github: https://github.com/okunamayanad/r-place-2023
  // @author       okunamayanad
  // @match        https://garlic-bread.reddit.com/embed*
  // @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
  // @grant        none
  // @license MIT
  // @downloadURL        https://github.com/okunamayanad/r-place-2023/raw/main/RPlace.2023.user.js
  // @updateURL        https://github.com/okunamayanad/r-place-2023/raw/main/RPlace.2023.user.js 
  // ==/UserScript==

  /*
   * Note: This script is based on the original script by @okunamayanad
   * Modified to work as a standalone chrome extension by @shotwn
   * 
   * It should still work as a userscript, but it is not tested.
   */
  
  // Debug Option
  const allowDebugLogging = true
  function logDebug(msg) {
    if (!allowDebugLogging) {
      return
    }

    console.log('RPlace 2023 TR:', msg)
  }

  function bindOverlay(requiredElements) {
    logDebug("Binding Overlay...");

    // Load the image
    const image = document.createElement("img");
    var d = new Date();
    image.src = "https://raw.githubusercontent.com/okunamayanad/r-place-2023/main/output.png?" + d.getTime();
    image.onload = () => {
        image.style = `position: absolute; left: 0; top: 0; width: ${image.width / 3}px; height: ${image.height / 3}px; image-rendering: pixelated; z-index: 1`;
    };

    // Add the image as overlay
    const camera = requiredElements.camera;
    const canvas = requiredElements.canvas;
    const container = canvas.shadowRoot.querySelector('.container')
    container.appendChild(image);

    // Add a style to put a hole in the pixel preview (to see the current or desired color)
    const preview = requiredElements.preview;
    const style = document.createElement('style')
    style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
    preview.shadowRoot.appendChild(style);
  }

  function getRequiredDOMElements () {
    // Use a programmatic approach to find the required DOM elements.
    // This will offer a quick fix for null reference errors if the DOM structure changes.
    logDebug('Checking required DOM elements.')

    // All required elements
    const requiredElements = {
      embed: {
        select: 'garlic-bread-embed'
      },
      camera: {
        select: 'garlic-bread-camera',
        parent: 'embed',
        useShadowRoot: true
      },
      canvas: {
        select: 'garlic-bread-canvas',
        parent: 'camera'
      },
      preview: {
        select: 'garlic-bread-pixel-preview',
        parent: 'camera'
      }
    }

    // Only found elements
    const foundElements = {}

    // Find elements
    for (const [key, selector] of Object.entries(requiredElements)) {
      let foundElement = null

      if (!selector.parent && !selector.shadowParent) { 
        // If no parent is specified, use document as parent.
        foundElement = document.querySelector(selector.select)
      } else { 
        // If parent is specified, use the parent element as parent.
        const parentElement = foundElements[selector.parent]

        if (!parentElement) { 
          // We already return when previous parent element is not found. But this is just a safety check.
          logDebug(`Parent Element Not Found -> ${selector.parent}`)
          return null // If any parent element is not found, return null from this function.
        }

        // This is a special case for shadowRoot. If shadowRoot is specified, use shadowRoot as parent.
        if (selector.useShadowRoot) {
          foundElement = parentElement.shadowRoot.querySelector(selector.select)
        } else {
          foundElement = parentElement.querySelector(selector.select)
        }
      }

      if (!foundElement) {
        logDebug(`DOM Element Not Found -> ${key}`)
        return null // If any element is not found, return null from this function.
      }

      foundElements[key] = foundElement
    }

    return foundElements
  }

  function waitAndBindOverlay () {
    if (window.top === window.self) {
      logDebug('Not in iframe. Skipping.')
      return
    }

    if (!document.URL || document.URL.indexOf('https://garlic-bread.reddit.com/embed') === -1) {
      logDebug('Not on Reddit r/Place embed page. Skipping.')
      return
    }

    const requiredElements = getRequiredDOMElements()
    
    // If any element is not found, try again after 100 ms.
    if (!requiredElements) {
      logDebug('Required DOM elements not found. Trying again in 100 ms.')
      setTimeout(waitAndBindOverlay, 100)
      return
    }

    // If all elements are found, bind the overlay.
    logDebug('Required DOM elements found. Binding overlay.')
    bindOverlay(requiredElements)
  }

  logDebug('Loading...')
  waitAndBindOverlay()
})();

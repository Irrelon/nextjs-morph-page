# Next.js Page Transitions with Element Morphing

This is a fork of the original work done here https://github.com/illinois/next-page-transitions and adds new functionality to morph pages at an element-level.

## Demo

You can see a basic demo of this library in action here: https://basic-usage-uwkrojwfad.now.sh/

> The demo is hosted on now.js. Start-up times on the now.js containers can take a long time if they haven't been used for a while. Just click the link and be patient :)

## Install

```bash
npm i nextjs-morph-page --save
```

## Usage

Make sure that your app has a custom App component; if not, [follow the example](https://github.com/zeit/next.js#custom-app) on the Next.js readme to create one. Then, in your App's render method, wrap the page Component in a MorphTransition component.

```js
import App, { Container } from 'next/app'
import React from 'react'
import MorphTransition from 'nextjs-morph-page'

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <MorphTransition timeout={300} classNames="morph">
          <Component {...pageProps} />
        </MorphTransition>
        <style jsx global>{`
          .morph.enter {
            opacity: 0;
          }
          .morph.enter.active {
            opacity: 1;
            transition: opacity 300ms;
          }
          .morph.exit {
            opacity: 1;
          }
          .morph.exit.active {
            opacity: 0;
            transition: opacity 300ms;
          }
        `}</style>
      </Container>
    )
  }
}
```

## Whole-Page Based Transitions

When you move to a new page, the `Component` will change, and the
`MorphTransition` component will detect that. Instead of immediately unmounting
the page, it will apply the `morph.exit` class to a wrapper around
the page to initialize the "exit" transition, and will then apply the
`morph.exit.active` class as well to begin the transition. This is
very similar to how the
[react-transition-group](https://github.com/reactjs/react-transition-group)
library does things things. After the previous page has been animated out,
the new page is mounted and a similar pair of `.morph.enter` and
`morph.enter.active` classes will be applied. This process repeats
every time a new page is navigated to.

## Element-Based Transitions

As you move from one page to another the individual elements on the page can
also be "morphed" from the source / current page to the target / destination
page. To indicate an element to be morphed you must provide the element with
an id that is the SAME ON BOTH PAGES as well as a data-morph-ms attribute indicating
the number of milliseconds the element's morph should take.

> There is a new experimental way to set the target of a morph operation from the
source element, via the data-morph-target attribute. This attribute takes a CSS
selector that is compatible with document.querySelector() and attempts to find
the target to morph to using that selector. Make sure the selector only returns
a single element as only the first matching element will be used as a target.
e.g. \<div class="foo" bar="true">...\</div> can be targeted by '.foo[bar="true"]'

The data-morph-ms attribute only needs to exist on the source page. If you want
transitions to occur on that element when the user navigates back from page 2
to page 1, as well as from page 1 to page 2, put a data-morph-ms on the element
on page 2 as well as page 1.

E.g:

#### Page 1

```html
<img src="image1.jpg" id="test1" data-morph-ms="300" />
```

#### Page 2

```html
<img src="image2.jpg" id="test1" data-morph-ms="300" />
```

Any css applied to the page 2 element "test1" will be applied as the morph transitions.

> VERY IMPORTANT: The plugin does not currently support having style attributes on an
element. If you apply styles directly on an element via the style="" attribute they will
be wiped out when a morph is applied. Use css selectors only.

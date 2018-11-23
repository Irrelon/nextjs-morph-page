# Irrelon Next.js Morph Page

## Install

```bash
npm i nextjs-morph-page --save
```

## Usage

Make sure that your app has a custom App component; if not, [follow the example](https://github.com/zeit/next.js#custom-app) on the Next.js readme to create one. Then, in your App's render method, wrap the page Component in a MorphTransition component.

```js
import App, { Container } from 'next/app'
import React from 'react'
import { MorphTransition } from 'next-page-transitions'

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
        <MorphTransition timeout={300} classNames="page-transition">
          <Component {...pageProps} />
        </MorphTransition>
        <style jsx global>{`
          .page-transition-enter {
            opacity: 0;
          }
          .page-transition-enter-active {
            opacity: 1;
            transition: opacity 300ms;
          }
          .page-transition-exit {
            opacity: 1;
          }
          .page-transition-exit-active {
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
the page, it will apply the `page-transition-exit` class to a wrapper around
the page to initialize the "exit" transition, and will then apply the
`page-transition-exit-active` class as well to begin the transition. This is
very similar to how the
[react-transition-group](https://github.com/reactjs/react-transition-group)
library does things things. After the previous page has been animated out,
the new page is mounted and a similar pair of `.page-transition-enter` and
`page-transition-enter-active` classes will be applied. This process repeats
every time a new page is navigated to.

## Element-Based Transitions

As you move from one page to another the individual elements on the page can
also be "morphed" from the source / current page to the target / destination
page. To indicate an element to be morphed you must provide the element with
an id that is the SAME ON BOTH PAGES as well as a data-morph attribute indicating
the number of milliseconds the element's morph should take.

E.g:

#### Page 1

```html
<img src="image1.jpg" id="test1" data-morph="300" />
```

#### Page 2

```html
<img src="image2.jpg" id="test1" data-morph="300" />
```

Any css applied to the page 2 element "test1" will be applied as the morph transitions.

> VERY IMPORTANT: The plugin does not currently support having style attributes on an
element. If you apply styles directly on an element via the style="" attribute they will
be wiped out when a morph is applied. Use css selectors only.

# zerodash

Home automation dashboard TUI built with Ink and Deno.

![Screenshot](https://github.com/leviceccato/zerodash/raw/main/src/common/images/screenshot.png)

## Features

- Spotify viewer
- Date and weather
- Bin collection notifier
- Calendar events

## Requirements

- Deno ^2.5

## Usage

Generate types for APIs and SSL certificates.

```sh
deno task gen-types && deno task gen-certs
```

Before running the app you will need to sign into the various APIs using OAuth. This will generate JSON tokens that will be automatically refreshed during runtime.

```sh
deno task gen-tokens
```

Run in dev mode.

```sh
deno task dev
```

Build into an executable.

```sh
deno task Build
```

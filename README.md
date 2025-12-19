worker-test

A small demo app to inspect Web Worker behavior.

- Hosted at: https://tats-u.github.io/worker-test/

## Notes

- If you enable the "Use Web Worker" checkbox in the app, you'll see the following error in the browser developer console (F12):

	ReferenceError: document is not defined

	This occurs because Web Workers run in a separate thread and do not have access to DOM global `document`. This is expected behavior.

## Run locally

```bash
pnpm install
pnpm run dev
```

Then open http://localhost:5173 in your browser.

## Build

```bash
pnpm run build
```

The production build is output to the `dist` folder.

## License

This repository is licensed under MIT-0. See the `LICENSE` file for details.

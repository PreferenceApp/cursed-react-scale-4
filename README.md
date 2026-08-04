# React + Vite
1. refactor the styling and simplify everything if possible
2a. Put Quota on the front page somewhere showing how many google image invocations are remaining for the day
2b. Add cors to node.js application so we can see total invocations. Make sure we set it initially to -1, and then cron jobs will set it to 0. That way if it ever is -1, we know: Not to increment it + it has been restarted
3. delete unnecessary code in main.js functions
4. Create a users endpoint with table so simok could query a user if he wanted. Need to shuffle all, include all read/write permissions to Simok for all messages and include "owner" -which includes simok's userid- for all of them. Delete weekday in folders and delete createdBy in messages in the console after transfer


This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

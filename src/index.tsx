#!/usr/bin/env node
import React from "react";
import { replaceTscAliasPaths } from "tsc-alias";

import { render } from "ink";

import { hideCursor } from "utils.js";
import App from "./app.js";

hideCursor();
replaceTscAliasPaths();
render(<App />, { exitOnCtrlC: false });

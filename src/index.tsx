#!/usr/bin/env node
import React from "react";

import { render } from "ink";

import { hideCursor } from "utils.js";
import App from "./app.js";

hideCursor();
render(<App />, { exitOnCtrlC: false });

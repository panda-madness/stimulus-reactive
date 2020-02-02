import { Application } from "@stimulus/core";
import { Reactive } from "./reactive";

const App = Application.start();

App.register('reactive', Reactive);
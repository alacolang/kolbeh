import { setQueues } from "bull-board";
import { happinessTryNextQueue } from "./queue";

setQueues([happinessTryNextQueue]);

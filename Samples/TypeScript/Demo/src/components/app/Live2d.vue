<template>
  <div id="canvasContainer"></div>
</template>

<script>
import { LAppDelegate } from "../../logic/lappdelegate";
import { LAppGlManager } from "../../logic/lappglmanager";
import { LAppLive2DManager } from "../../logic/lapplive2dmanager";
import {
  MotionGroupIdle,
  MotionGroupTapBody,
  PriorityForce,
  PriorityIdle,
  PriorityNormal,
} from "../../logic/lappdefine";

export default {
  mounted() {
    if (
      !LAppGlManager.getInstance() ||
      !LAppDelegate.getInstance().initialize()
    ) {
      return;
    }
    LAppDelegate.getInstance().run();
  },
  name: "Live2d",
};
</script>

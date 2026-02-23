import { onRequestOptions as __api_r2_upload_ts_onRequestOptions } from "C:\\Users\\maxma\\OneDrive\\Bureaublad\\The Consis Network\\Workspace CNW\\MijnKot\\functions\\api\\r2\\upload.ts"
import { onRequestPost as __api_r2_upload_ts_onRequestPost } from "C:\\Users\\maxma\\OneDrive\\Bureaublad\\The Consis Network\\Workspace CNW\\MijnKot\\functions\\api\\r2\\upload.ts"

export const routes = [
    {
      routePath: "/api/r2/upload",
      mountPath: "/api/r2",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_r2_upload_ts_onRequestOptions],
    },
  {
      routePath: "/api/r2/upload",
      mountPath: "/api/r2",
      method: "POST",
      middlewares: [],
      modules: [__api_r2_upload_ts_onRequestPost],
    },
  ]
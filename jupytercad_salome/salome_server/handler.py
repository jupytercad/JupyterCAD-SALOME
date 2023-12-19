import json
from jupyter_server.base.handlers import APIHandler
import tornado

try:
    from .mesh_builder import build_mesh
except ImportError:
    build_mesh = None


class SalomeHandler(APIHandler):
    @tornado.web.authenticated
    def post(self):
        if build_mesh is None:
            self.finish(json.dumps({"mesh": "", "format": "obj"}))
        else:
            data = self.get_json_body()
            geometry = data.get("geometry", None)
            n_segmen = data.get("numberOfSegments", 12)
            jcad_path: str = data.get("sourcePath", None)
            if jcad_path:
                jcad_path = jcad_path.replace("RTC:", "")

            mesh_content = ""
            if geometry:
                mesh_content = build_mesh(geometry, n_segmen, jcad_path)

            self.finish(json.dumps({"mesh": mesh_content, "format": "obj"}))

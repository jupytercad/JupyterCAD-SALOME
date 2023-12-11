import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado

from .salome_server.handler import SalomeHandler

API_NAMESPACE = "jupytercad-salome"


class RouteHandler(APIHandler):
    @tornado.web.authenticated
    def get(self):
        """Return the base url of the jupytercad salome server.
        Use ``None`` if it is the same JupyterLab server
        """
        self.finish(
            json.dumps(
                {
                    "backend_url": None,
                }
            )
        )


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]

    route_pattern = url_path_join(base_url, API_NAMESPACE, "get-backend")

    salome_pattern = url_path_join(base_url, API_NAMESPACE, "execute")

    handlers = [(route_pattern, RouteHandler), (salome_pattern, SalomeHandler)]

    web_app.add_handlers(host_pattern, handlers)

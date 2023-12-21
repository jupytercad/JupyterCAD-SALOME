# jupytercad_salome

[![Github Actions Status](https://github.com/jupytercad/jupytercad-salome/workflows/Build/badge.svg)](https://github.com/jupytercad/jupytercad-salome/actions/workflows/build.yml)
A JupyterLab extension.

JupyterCAD-Salome is an extension for JupyterCAD which enables users to generate meshes from their creations in JupyterCAD, leveraging the powerful meshing capabilities of Salome, a leading open-source platform for numerical simulation.

JupyterCAD-Salome is currently in active development.

[Creating a mesh with JupyterCAD in combination with JupyterCAD-Salome](https://github.com/martinRenou/jupytercad-salome/assets/21197331/733f5207-0e2f-4e33-9158-fb4289706463)

As you can see in the video above, JupyterCAD-Salome will add a new button to the JupyterCAD toolbar allowing to generate a mesh from the currently selected object in the JupyterCAD viewer.

![JupyterCAD-Salome toolbar option](https://github.com/martinRenou/jupytercad-salome/assets/21197331/8a97527f-c1e2-466e-b122-483de626dc6e)

## Try it live

A deployment is published for you to give it a try:
https://trungleduc-jupytercad.hf.space/lab

This demo is entirely collaborative, which means anybody getting to this link will
see what you do and be able to collaborate with you.

You can make your own deployment on HuggingFace pressing the "⋮" button on the top-right corner of the page, then "Duplicate this Space"

![Duplicate app button](https://github.com/martinRenou/jupytercad-salome/assets/21197331/77909be2-6263-4149-b9c0-ab837d86a82d)

## Local Install

1. Install Salome from https://www.salome-platform.org/?page_id=2430
2. To install the extension, execute:
   ```bash
   pip install jupyterlab
   pip install --pre jupytercad jupytercad-salome
   ```

Then you can either start JupyterLab or JupyterCAD:

```bash
jupyter lab
# OR
jupyter cad
```

## Implementation

JupyterCAD-Salome consists of two components:

- a jupyter-server endpoint which is ready to compute the mesh upon client demand. The enpoint is defined using [an OpenAPI spec](https://github.com/jupytercad/jupytercad-salome/blob/main/jupytercad_salome/schema/openapi.yaml).
- a client plugin for JupyterCAD which adds a toolbar button which calls this endpoint.

Whenever the user clicks on the toolbar button, they are prompted with configuring the API call:

![Meshing configuration](https://github.com/martinRenou/jupytercad-salome/assets/21197331/15b03e37-3716-4f82-b5bf-b99abed6c016)

> [!NOTE]
> This user interface is generated automatically from the endpoint spec.

Once the API call is made, the server will compute the mesh using [smesh](https://www.salome-platform.org/?page_id=374) and send back the response with the computed mesh to the client.

The user can later-on re-generated the mesh with different inputs:

![Configuring the mesh afterwards](https://github.com/martinRenou/jupytercad-salome/assets/21197331/9d58e5df-c952-4f5d-b4f7-be189fc80b55)

### Packaging the extension

See [RELEASE](RELEASE.md)

# jupytercad_salome

[![Github Actions Status](https://github.com/jupytercad/jupytercad-salome/workflows/Build/badge.svg)](https://github.com/jupytercad/jupytercad-salome/actions/workflows/build.yml)
A JupyterLab extension.

JupyterCAD-Salome is a backend extension for JupyterCAD which enables users to generate meshes from their creations in JupyterCAD, leveraging the powerful meshing capabilities of Salome, a leading open-source platform for numerical simulation.

JupyterCAD-Salome is currently in active development.

[Creating a mesh with JupyterCAD in combination with JupyterCAD-Salome](https://github.com/martinRenou/jupytercad-salome/assets/21197331/733f5207-0e2f-4e33-9158-fb4289706463)

As you can see in the video above, JupyterCAD-Salome will add a new button to the JupyterCAD toolbar allowing to generate a mesh from the currently selected object.

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

### Packaging the extension

See [RELEASE](RELEASE.md)

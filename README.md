# jupytercad_salome

[![Github Actions Status](https://github.com/jupytercad/jupytercad-salome/workflows/Build/badge.svg)](https://github.com/jupytercad/jupytercad-salome/actions/workflows/build.yml)
A JupyterLab extension.

JupyterCAD-Salome is a backend extension for JupyterCAD which enables users to generate meshes from their creations in JupyterCAD, leveraging the powerful meshing capabilities of Salome, a leading open-source platform for numerical simulation.

JupyterCAD-Salome is currently in active development.

## Try it live

A deployment is published for you to give it a try:
https://trungleduc-jupytercad.hf.space/lab

This demo is entirely collaborative, which means anybody getting to this link will
see what you do and be able to collaborate with you.

## Install

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

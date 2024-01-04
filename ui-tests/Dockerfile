FROM trungleduc/salome-docker:9.10.0

ARG MAMBA_DOCKERFILE_ACTIVATE=1

WORKDIR /home/$MAMBA_USER/cad

COPY --chown=$MAMBA_USER:$MAMBA_USER ./jupyter_server_test_config.py ./jupytercad_salome*.whl ./

RUN python -m pip install jupyterlab "jupytercad>=1.0.0a4" jupytercad_salome*.whl

EXPOSE 8888
CMD source /home/user/salome_src/default_env_launch.sh && jupyter lab --config jupyter_server_test_config.py

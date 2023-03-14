#!/bin/bash

# Downgrade netmiko to version 3.4.0
pip install netmiko==3.4.0

# Start the Streamlit app
streamlit run --server.port 8501 /app/app.py

FROM python:3.10-slim

# Set the working directory to /app
WORKDIR /app

# Copy the requirements.txt file to the working directory
COPY requirements.txt .

# Make sure requests is installed
RUN pip install requests

# Install the required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire app folder to the working directory
COPY app/ /app/

# Copy the startup script to the working directory
COPY startup.sh .

# Make the startup script executable
RUN chmod +x startup.sh

# Start the Streamlit app using the startup script
CMD ["/bin/bash", "startup.sh"]

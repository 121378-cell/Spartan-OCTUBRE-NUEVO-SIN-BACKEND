# 1. Base Image
FROM python:3.10-slim

# 2. Set Working Directory
WORKDIR /app

# 3. Copy and Install Dependencies
# Copy the requirements file from the 'api' subdirectory of the build context
COPY api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4. Copy Application Code
# Copy the entire 'api' subdirectory from the build context to the container's WORKDIR
COPY api/ .

# 5. Expose Port
EXPOSE 8000

# 6. Run Command
# The command is executed from the WORKDIR (/app)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
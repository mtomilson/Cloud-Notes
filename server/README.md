## Setup Instructions

### 1. Navigate to the `server` directory
```bash
cd server
```

### 2. Create a virtual environment
Create a virtual environment named `env` to manage dependencies.

```bash
python3 -m venv env
```

### 3. Activate the virtual environment
Activate the environment to start using it.

- On macOS/Linux:
  ```bash
  source env/bin/activate
  ```
- On Windows:
  ```bash
  .\env\Scripts\activate
  ```

### 4. Install dependencies
Install the required Python packages for the scraper to run:

```bash
pip install -r requirements. txt
```

### 5. Create a `.env` file
Create a `.env` file in the `server` directory with the following content:

```bash
OPENAI_API_KEY=your_openai_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
```
# Image-gen

This project generates images from text descriptions using OpenAI's Dall-E 2 model. It's a full-stack web application integrated with the OpenAI API and deployed using Vercel for fast, scalable hosting.

![OG Image](/public/ogimage.png)

## Features

- **Text-to-Image AI Generation**: Input a text prompt, and the Dall-E 2 model generates a unique image based on the description.
- **OpenAI API Integration**: Leveraging OpenAI’s powerful Dall-E 2 model for image creation.
- **Scalable Deployment**: Easily deploy the project on Vercel with a single click.
- **Upstash & Redis**: Utilized for message queuing and efficient data management.
- **Local Development Support**: Run the application locally for development and testing.

## Getting Started

### Prerequisites

1. **OpenAI API Key**:  
   Sign up at [OpenAI](https://openai.com) and create a new API key.
   
2. **Environment Variable**:  
   Set up the `OPENAI_API_KEY` environment variable to use the OpenAI API.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/domeccleston/dalle-2.git
    ```

2. Navigate to the project directory

    ```bash
    cd dalle-2
    ```

3. Install dependecies: 

    ```bash 
    npm install
    ```

4. Set up the OpenAI API key:

    Create a .env.local file in the root of the project.
    Add the following line to it:
    ```bash
    OPENAI_API_KEY=your-openai-api-key-here
    ```
5. Start the application:

    ```bash
    npm run dev
    ```

    The application will be available at http://localhost:3000.

### Technologies Used 
    Frontend:                   React, Next.js
    Backend:                    Node.js, OpenAI API
    Deployment:                 Vercel
    Database/Message Queue:     Redis, Upstash
Version Control:                Git, GitHub
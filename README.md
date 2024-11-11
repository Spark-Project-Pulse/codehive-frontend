# Pulse (frontend)

<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Spark-Project-Pulse/backend">
<!--     <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
  </a>

<h3 align="center">Pulse</h3>

  <p align="center">
    Buzz Buzz
    <br />
    <a href="https://github.com/Spark-Project-Pulse/backend"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/Spark-Project-Pulse/backend">View Demo</a>
    ·
    <a href="https://github.com/Spark-Project-Pulse/backend/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/Spark-Project-Pulse/backend/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![image](https://github.com/user-attachments/assets/bd869a9d-e1ce-4f72-9deb-1564026b56f1)


CodeHive aims to be a tool to help aspiring developers get fast, reliable, and contextual feedback on their questions. This is achieved by enabling seamless project integration and providing holistic context to related questions.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* npm
  ```sh
   npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Spark-Project-Pulse/frontend.git
   ```
2. Install NPM packages
   ```sh
    npm install
    ```

### Environment Variables
See the following article for a detailed explanation of how to manage environment variables in a Next.js project: [https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)

- TLDR:
- Environment variables are NOT to be used as secrets. To add a secret to the project, use the get_secret function in your code and follow [these directions](#updating-secrets) to add the secret to Google Secret Manager.
- To add an environment variable to the project (for example, anything with the name `NEXT_PUBLIC_*`), add the development value of the variable to `.env.development` in the format `VARIABLE_NAME=value` and the production value to `.env.production` in the format `VARIABLE_NAME=value`. The variable will be available in the project as `process.env.VARIABLE_NAME`.

### Secret Management
#### Accessing Secrets locally
1. Go to the Google Cloud Console, navigate to `IAM & Admin` > `Service Accounts`, and and download the already existing json key from the service acount called Secret Accessor Service Account. Go to the `Keys` tab and click `Add Key` then `Create New Key` then `Create` (use json format). Your key will download as `pulse-random-letters-and-numbers.json` in the root of the project.
2. Add a `.env.local` file to the root of the project with the following contents:
``` bash
GOOGLE_CLOUD_PROJECT=google_cloud_project_id
GOOGLE_APPLICATION_CREDENTIALS=pulse-random-letters-and-numbers.json
```
3. **server-side code**: Use the `getSecret` function in `src/lib/getSecret.ts` to access secrets stored in Google Secret Manager locally. The function takes the secret name as an argument and returns the secret value.
   1. (you should ONLY use this function in server-side functions labelled with `'user-server'`)
4. **client-side code**: Use the `getSecrets` function in `src/api/getSecrets.ts` which is a Next.js endpoint that is called on the server (since the `getSecret` function requires server-side dependencies)
   1. (you should ONLY use this function in client-side functions labelled with `'use-client'` or no label)

#### Updating Secrets
To ensure they will be available in production and consistent across all environments and between developers, secrets should be stored in Google Secret Manager. To update a secret:
1. Navigate to the Google Cloud Console
2. Select the project `Pulse`
3. Navigate to `Secret Manager`
4. Select the secret you want to update
5. Click `Delete` to delete the secret
6. Now recreate the secret with the new value (I am aware this is kind of a pain, but I haven't researched how versions work yet)

#### Creating New Secrets
For the frontend, there are only two kinds of secrets: local and production. When creating a new secret, make sure to add the production version by appending `_PRODUCTION` to the secret name and the local version by appending `_LOCAL`. Even if the secret is the same for both environments, it should be added twice to ensure that the secret is available in both environments. The getSecret function handles the logic of which secret to return based on the environment, so after adding the secret to Google Secret Manager, it should be accessible via the function.

#### Steps for creating a new secret via the Google Cloud Console UI:
1. Navigate to the Google Cloud Console
2. Select the project `Pulse`
3. Navigate to `Secret Manager`
4. Select the secret you want to update
5. Click `Create Secret`
6. Enter the secret's name and value
7. Click `Create Secret`

### Run locally

#### Docker 
##### Running the frontend
1. Make sure the Docker daemon is running (open Docker Desktop)
2. Navigate to the frontend repository
3. Use this command to build and run the backend container:
   ``` bash
   docker compose up --build
   ```
4. Navigate to `http://localhost:3000` to see an example of an API response

##### Running the frontend & backend in one command
1. Make sure the Docker daemon is running (open Docker Desktop)
2. Navigate to the frontend repository
3. Make sure the backend repository is in the same directory as the frontend repository
4. Use this command to run the project locally:
   ``` bash
    docker compose --profile frontend-and-backend up --build
   ```
5. This will run the frontend and backend in separate containers

#### Node
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Usage

### User Authentication

Since we are using [Supabase Auth](https://supabase.com/docs/guides/auth), there are two types of user-schemas that we have access to (see backend `models.py` for more details on `AuthUser` and our custom `User`).

#### 1. Getting Custom `User` from "client" code

In general, we will want to use the custom `User` schema to get important information about the user that needs to be rendered by the client. HOWEVER, in order to do so, we first need to use Supabase's getUser function to get the user's id. You can simply use the `useUser` context to auto-"magically" fetch the user:

``` ts
import { useUser } from '@/app/contexts/UserContext'

export default function YourComponent () {
  const { user, loading } = useUser()
  ...
}

```

#### 2. Getting Custom `AuthUser` from "server" code

So far, it seems that the main use for getting the `AuthUser` in server-side code (i.e. functions/files in `src/api`) would be to pass in the active `user_id` to the backend API. This is useful for creating objects associated with that user. To do so, you should use the `getSupaUser` function from `utils/supabase/server`. Here is an example for uploading projects:

``` ts
import { getSupaUser } from '@/utils/supabase/server';

export const createProject = async (values: {
    public: boolean;
    title: string;
    description: string;
  }): Promise<ApiResponse<{ project_id: string }>> => {
    try {
      const user = await getSupaUser()

      const vals = { owner: user?.id, ...values }

      ...
```



<p align="right">(<a href="#readme-top">back to top</a>)</p>



See the [open issues](https://github.com/Spark-Project-Pulse/backend/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/Spark-Project-Pulse/backend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Spark-Project-Pulse/backend" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

CodeHive - codehivebuzz@gmail.com

Project Link: [https://github.com/Spark-Project-Pulse/backend](https://github.com/Spark-Project-Pulse/backend)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* CodeHive Team

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Spark-Project-Pulse/backend.svg?style=for-the-badge
[contributors-url]: https://github.com/Spark-Project-Pulse/backend/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Spark-Project-Pulse/backend.svg?style=for-the-badge
[forks-url]: https://github.com/Spark-Project-Pulse/backend/network/members
[stars-shield]: https://img.shields.io/github/stars/Spark-Project-Pulse/backend.svg?style=for-the-badge
[stars-url]: https://github.com/Spark-Project-Pulse/backend/stargazers
[issues-shield]: https://img.shields.io/github/issues/Spark-Project-Pulse/backend.svg?style=for-the-badge
[issues-url]: https://github.com/Spark-Project-Pulse/backend/issues
[license-shield]: https://img.shields.io/github/license/Spark-Project-Pulse/backend.svg?style=for-the-badge
[license-url]: https://github.com/Spark-Project-Pulse/backend/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/

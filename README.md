# REPO LISTER

## Your application and technical choices

This is a React + Typescript application that uses the Github API, Ockokit, to list the repositories of a given user or organization. This was created using create-react-app with typescript template for easy setup. It also uses eslint and prettier for code formatting and linting, with some minor changes to the config for cleanliness and to ease development. Most other dependencies just leverage the tools provided by create-react-app.

As mentioned before I used Octokit dependency which makes making requests to the Github API very easy. To get it integrated I used React Context to provide the Octokit instance to the rest of the application, this also made mocking and testing much easier as it de-couples the UI from service logic. I noticed octokit also has a graphql client, which I would have used if I had more time to explore it, but for this case just using the REST API was the simplest solution.

The only other non dev dependency is react-dropdown to be able to easily implement dropdowns without having to create my own (a hot topic in a previous job). I found during writing tests however that this library does not play well with react-testing-library, and the docs do not provide a testing strategy, if given more time I would have switched it for another library or made custom dropdown.

I paid some attention to the folder structure to give some logical seperation between the various components and services. Note that src/components/common only has an ErrorMessage Component, this demonstrates how I would treat components that would likely be re-used across the application, I could have portentially added button, input components and flex table components as well, a basis to start a component library with something like Storybook.

For styling I stuck to the the basics of what was supplied, in a bigger project I would have considered Styled Components or SCSS to make styling more maintainable. I did however pay some attention to how style classes are organized. General reusable styles were all kept at the root App.css file, while component specific styles were kept in the same folder as the component. Making it easier to find and maintain styles.

## Steps to run the application

Requirements:

- Yarn
- Node 18

Steps to run:

```bash
yarn
yarn start
```

`yarn start` will run the application on port 3000

Steps to test:

```bash
yarn
yarn test
```

## What steps you would take to make it deployable

I would use a CI/CD tool, most likely Github Actions to run tests and a linter and build the application. I would consider code analysis for quality and security as well, in particular dependencies can lead to potential security issues. Based on the tools I know I would use AWS Amplify to deploy the application to AWS S3 and use Cloudfront to serve the application. I would also use Route53 to setup a custom domain for the application.

## Ideas for new features you could implement

- Add number of stars to the repository list.
- Add number of contributions made by a user to a repository.
- Instead of re-directing to the repository page directly, show a modal with more information about the repository.
- Add authentication to allow users to see private repositories they have access to.
- Create a tailored interface that allows users to have an overview of the repositories they or their organisation owns.
- Create an interface that helps users keep on to of their PRs and PRs where a review was requested.

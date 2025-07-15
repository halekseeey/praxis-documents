# Praxis Documentation

This is the deployed documentation for the Praxis project. It is designed to be clear and user-friendly, supporting both light and dark themes as well as full responsiveness for mobile and desktop devices.

## Project Structure

- All documentation is stored in the `src/content` folder as Markdown (`.md`) files.
- The structure of the `src/content` folder reflects the navigation structure of the documentation.
- Subfolders are used for organization (for example, `core-concepts`, `getting-started`, `tools`, etc.).
- For a directory to appear in the navigation bar, it must contain at least one `.md` file.
- If the only file in the directory is named `coming-soon.md`, the directory will still be shown in the navigation, but navigation to this file will be disabled (the section will be marked as "coming soon").

## Working with Images

- All images used in the documentation must be stored in the `static/images` folder.
- Links to images in Markdown files must start with `images/`.
- Example of inserting an image:

```md
![Image description](images/diagrams/example_agent.png)
```

## Cross-page Links

- To create links to other documentation pages, use the absolute path from the root, without specifying the `content` folder.
- Example of a cross-page link to the page `core-concepts/agents.md`:

```md
[Read more about agents](core-concepts/agents.md)
```

- Do not use relative paths and do not include the `content` folder in links.

## Example Structure

```
src/content/
  core-concepts/
    agents.md
    overview.md
  getting-started/
    quickstart.md
  tools/
    openai_request.md
  providers/
    coming_soon.md
```

## Configuration File

- The file `src/lib/config` is used to configure the documentation site.
- In this file, you can:
  - Specify the order of top-level documentation sections for navigation.
  - Set links to social networks.
  - Set the documentation version.

## Summary of Rules

- All `.md` files — only in `src/content`.
- All images — only in `static/images`.
- Image links — must start with `images/`.
- Cross-page links — use absolute paths, without `content`.
